import nodemailer, { TransportOptions } from "nodemailer";

// <- *** INTERFACE FOR OPTIONS *** ->
interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: EmailOptions) => {
  // <- *** CREATE A TRANSPORTER *** ->

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  } as TransportOptions);

  // <- *** DEFINE THE EMAIL OPTIONS *** ->

  const mailOptions = {
    from: "NFT BAZAAR <admin@nftbazaar.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // WE CAN ALSO ABLE TO SEND THE HTML
  };

  // <- *** SEND EMAIL *** ->
  await transporter.sendMail(mailOptions);
};

//=========================================================================================
// <- EXPORTS ->
//=========================================================================================

export default sendEmail;
