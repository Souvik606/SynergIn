import { mailtrapClient, sender } from "../lib/mailtrap.js";
import {createConnectionAcceptedEmailTemplate, createWelcomeEmailTemplate,} from "./emailTemplates.js";

export const sendWelcomeEmail = async(email, name, profileUrl) => {
  const recipient = [{email}];

  try {
    const response =await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to Synergein",
      html: createWelcomeEmailTemplate(name, profileUrl),
      category: "welcome",
    });

    console.log("Welcome Email sent successfully", response);
  } catch (error) {
    throw error;
  }
}

export const sendConnectionAcceptedEmail = async (senderEmail, senderName, recipientName, profileUrl) => {
  const recipient = [{ email: senderEmail }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: `${recipientName} accepted your connection request`,
      html: createConnectionAcceptedEmailTemplate(senderName, recipientName, profileUrl),
      category: "connection_accepted",
    });
  } catch (error) {}
};