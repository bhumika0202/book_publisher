import { stat } from "fs";
import transporter from "../config/mail.config.js";

export async function sendWelcomeMail(email, name) {
    transporter.sendMail({
        to : email,
        subject : "Registration successfull!!",
        html : `
            <h4>Hello ${name}<h4>
            <p>Welcome on web<p>
            <p>Your account has been created successfully<p>
        `
    });
}

export async function otpMail(email,otp) {
    transporter.sendMail({
        to : email,
        subject : "Authentication needed!!",
        html : `
            <h4>Hello <h4>
            <p>Welcome on web<p>
            <p>Your account login otp is :${otp}<p>
            <p>please don't share it to anyone<p>
        `
    });
}

export async function forgetPwdEmail(email,otp) {
    transporter.sendMail({
        to : email,
        subject : "Authentication needed!!",
        html : `
            <h4>Hello <h4>
            <p>Welcome on web<p>
            <p>Your account forget password otp is :${otp}<p>
            <p>If not requested, contact customer care<p>
        `
    });
}

export async function publishingEmail(email, publishMode) {
    let semail = "bhumiparmar222000@gmail.com";
    transporter.sendMail({
        to : email || semail,
        subject : "Book publishing update!!",
        html : `
            <h4>Hello <h4>
            <p>Greating from web<p>
            <p>Your book published ${publishMode} successfully <p>
        `
    });
}

export async function unPublishingEmail(email) {
    let semail = "bhumiparmar222000@gmail.com";
    transporter.sendMail({
        to : email || semail,
        subject : "Book publishing update!!",
        html : `
            <h4>Hello <h4>
            <p>Greating from web<p>
            <p>Your book unpublished successfully <p>
        `
    });
}

export async function statusChangeEmail(email) {
    let semail = "bhumiparmar222000@gmail.com";
    transporter.sendMail({
        to : email || semail,
        subject : "Status change!!",
        html : `
            <h4>Hello <h4>
            <p>Greating from web<p>
            <p>Status changed successfully <p>
        `
    });
}

export async function orderplaced(email) {
    let semail = "bhumiparmar222000@gmail.com";
    transporter.sendMail({
        to : email || semail,
        subject : "order placed!!",
        html : `
            <h4>Hello <h4>
            <p>Greating from web<p>
            <p>Your order for book placed successfully <p>
        `
    });
}

export async function orderUpdateEmail(email, status) {
    let semail = "bhumiparmar222000@gmail.com";
    transporter.sendMail({
        to : email || semail,
        subject : "order Updates!!",
        html : `
            <h4>Hello <h4>
            <p>Greating from web<p>
            <p>Your order is ${status }. <p>
        `
    });
}

export async function newOrder(email) {
    transporter.sendMail({
        to : email,
        subject : "order placed!!",
        html : `
            <h4>Hello <h4>
            <p>Greating from web<p>
            <h3>New order for book printing.<h3>
            <p>kindly approve or reject order <p>
        `
    });
}

export async function paymentMail(email) {
    transporter.sendMail({
        to : email,
        subject : "paymment successfull!!",
        html : `
            <h4>Hello <h4>
            <p>Greating from web<p>
            <h3>Your payment for your book order is done.<h3>
        `
    });
}

export async function paymentStatusEmail(email, status) {
    transporter.sendMail({
        to : email,
        subject : "payment update!!",
        html : `
            <h4>Hello <h4>
            <p>Greating from web<p>
            <h3>Your payment status is : ${status}.<h3>
        `
    });
}