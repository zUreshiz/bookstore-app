import crypto from "crypto";
import https from "https";
import Order from "../../model/Order.js";
export const paymentMomo = async (req, res) => {
  try {
    // 2. Nhận orderId từ Frontend gửi lên (qua body hoặc params)
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    // 3. Tìm đơn hàng trong Database
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 4. Lấy thông tin từ Order để cấu hình Momo
    // Lưu ý: Momo yêu cầu amount là String và không có số thập phân

    const RATE = 1000;
    const amount = Math.round(order.totalAmount * RATE).toString();

    // Config Momo
    const accessKey = "F8BBA842ECF85"; // Nên để trong .env
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"; // Nên để trong .env
    const orderInfo = `Pay for Order #${order._id}`;
    const partnerCode = "MOMO";
    const redirectUrl = `http://localhost:5173/payment-result`; // Link quay về sau khi thanh toán xong
    const ipnUrl = "https://1b23b1de85a3.ngrok-free.app/api/payment/momo/ipn"; // Link Momo gọi lại báo kết quả (Cần Public URL)
    const requestType = "payWithMethod";

    // Tạo mã đơn hàng cho Momo.
    // Lưu ý: Momo yêu cầu orderId là duy nhất cho mỗi lần request.
    // Nếu user thanh toán thất bại và ấn lại, orderId phải khác nhau.
    // Cách tốt nhất: orderIdMomo = order._id + "_" + timestamp
    const orderIdMomo = order._id.toString() + "_" + new Date().getTime();
    const requestId = orderIdMomo;

    const extraData = ""; // Có thể lưu email user vào đây: "email=user@gmail.com"
    const orderGroupId = "";
    const autoCapture = true;
    const lang = "vi";

    // --- ĐOẠN DƯỚI GIỮ NGUYÊN ---

    // Raw signature
    const rawSignature =
      `accessKey=${accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&ipnUrl=${ipnUrl}` +
      `&orderId=${orderIdMomo}` + // Dùng biến mới orderIdMomo
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${partnerCode}` +
      `&redirectUrl=${redirectUrl}` +
      `&requestId=${requestId}` +
      `&requestType=${requestType}`;

    console.log("RAW SIGNATURE:", rawSignature);

    // HMAC SHA256
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    console.log("SIGNATURE:", signature);

    // Body gửi tới Momo
    const requestBody = JSON.stringify({
      partnerCode,
      partnerName: "Bookstore",
      storeId: "MomoTestStore",
      requestId,
      amount,
      orderId: orderIdMomo, // Dùng biến mới
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      orderGroupId,
      signature,
    });

    // HTTPS Request Options
    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };

    // Gửi request tới Momo
    const momoReq = https.request(options, (momoRes) => {
      let data = "";

      momoRes.on("data", (chunk) => {
        data += chunk;
      });

      momoRes.on("end", () => {
        console.log("Momo Response:", data);
        try {
          const json = JSON.parse(data);
          const payUrl = json.payUrl || json.deeplink || json.shortLink;

          if (!payUrl) {
            return res
              .status(400)
              .json({ message: "Momo not returning payUrl", raw: json });
          }

          return res.status(200).json({ payUrl });
        } catch (err) {
          res.status(500).json({ message: "Invalid JSON from Momo" });
        }
      });
    });

    momoReq.on("error", (e) => {
      console.error("HTTPS Request Error:", e);
      res.status(500).json({ message: "Payment request failed", error: e.message });
    });

    momoReq.write(requestBody);
    momoReq.end();
  } catch (error) {
    console.error("paymentMomo Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// export const paymentMomoResult = async (req, res) => {
//   console.log("Payment Result Query:", req.query);
// };
// export const updatePaymentMomoStatus = async (req, res) => {
//   try {
//     let momoOrderId = req.body.orderId;
//     let originalOrderId = momoOrderId.split("_")[0]; // Lấy ID Mongo

//     const resultCode = req.body.resultCode;

//     if (Number(resultCode) === 0) {
//       const order = await Order.findById(originalOrderId);
//       if (!order) {
//         return res.status(404).json({ message: "Order not found" });
//       }

//       order.isPaid = true;
//       order.status = "processing";
//       order.paidAt = Date.now();
//       order.paymentResult = req.body;

//       await order.save();
//       return res.status(200).json({ message: "Updated success" });
//     }

//     return res.status(400).json({ message: "Payment failed" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
export const handleMomoIPN = async (req, res) => {
  const data = req.body;
  console.log("IPN from Momo:", data);

  const { orderId, resultCode, amount } = data;

  if (Number(resultCode) === 0) {
    try {
      const order = await Order.findById(orderId.split("_")[0]); // orderIdMomo = orderId + timestamp
      if (!order) return res.status(404).json({ message: "Order not found" });

      order.isPaid = true;
      order.status = "processing";
      order.paidAt = Date.now();
      order.paymentResult = {
        id: orderId,
        status: "success",
        update_time: Date.now(),
        amount: amount,
      };

      await order.save();
      return res.status(200).json({ message: "Payment confirmed" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    return res.status(400).json({ message: "Payment failed" });
  }
};
