require('dotenv').config();
const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const RolePermissons = require("../../models/role_permissions");
const Account = require("../../models/account");
const bcrypt = require("bcrypt");
const axios = require('axios');
const Sib = require('sib-api-v3-sdk')	
// Send email for registration	
"use strict";	
const nodemailer = require("nodemailer");	
async function postDatamail(data) {	
	console.log('main data', data.email);	
	var nm = data.name;	
		
	var new_nm = nm.replaceAll(' ', '_');	
	 const url = 'https://9estate.com/mail/sendmail/test.php?email='+data.email+'&username='+data.username+'&name_new='+new_nm+'&encoded_email='+data.path_url; // Replace with your PHP server URL and endpoint    
	try {	
	  const response = await axios.post(url, data);	
	  console.log('Post request successful!', response.data);	
	  // Handle the response from the PHP server	
	} catch (error) {	
	  console.error('Error occurred:', error);	
	  // Handle the error	
	}	
}	
async function postingForgotPassmail(data) {	
    console.log('find in function ', data);	
	const url = 'https://9estate.com/mail/sendmail/forgot_password_email.php?email='+data.email+'&encoded_email='+data.encoded_email; // Replace with your PHP server URL and endpoint	
    console.log(url);	
	try {	
	  const response = await axios.post(url, data);	
	  console.log('Post request forgot pass successful!', response.data);	
	  // Handle the response from the PHP server	
	} catch (error) {	
	  console.error('Error occurred:', error);	
	  // Handle the error	
	}	
}
async function main(email,name,pathUrl) {
  let emailencrypt=(btoa(email));
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: process.env.host,
    port: process.env.port,
    secure: process.env.secure,
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });
  let info = await transporter.sendMail({
    from: 'sales@avitronmailer.ga',
    to: email,
    subject: "9Estate - Registration successful ✔",
    text: "9Estate - Registration successful.",
    html: '<head> <!--[if gte mso 15]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> <![endif]--> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,500,500i,700,700i" rel="stylesheet"><!--<![endif]--> <title></title> </head> <body> <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0px auto;"> <tbody> <tr> <td class="fusionResponsiveCanvas" valign="top" style="width:100%;padding-top:15px;padding-bottom:15px;background-color:rgb(246,246,246);background-repeat:no-repeat;font-family:sans-serif;"> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(25,118,210);"> <tbody> <tr> <td style="background-color:rgb(25,118,210);padding:7px 15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <div data-aqa="block-image" style="overflow:hidden;"> <table cellpadding="0" cellspacing="0" border="0" style="width:100%;"> <tbody> <tr> <td class="null" style="padding:0px 0px 20px;"> <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin:auto;width:59%;"> <tbody> <tr> <th style="display:block;border-color:transparent;border-style:none;border-width:0px;"> <img src="https://i.imgur.com/HRvqyP2.png" class="fusionResponsiveImage" alt="" width="318" height="auto" style="display:block;width:318px;height:auto;margin:auto;background-color:transparent;"> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(255,255,255);"> <tbody> <tr> <td style="background-color:rgb(255,255,255);padding:15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;"> <tbody> <tr> <td style="padding-top:10px;padding-bottom:10px;"> <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0px auto;width:100%;"> <tbody> <tr> <td style="mso-line-height-rule:exactly;font-size:0px;line-height:0px;border-bottom:1px solid rgb(136,136,136);"> &nbsp; </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(255,255,255);"> <tbody> <tr> <td style="background-color:rgb(255,255,255);padding:15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" style="width:100%;"> <tbody> <tr> <td> <div data-fusion-class="" style="margin:0px;padding:0px;border-color:transparent;border-width:0px;border-style:none;background-color:transparent;display:block;color:rgb(51,51,51);font-family:sans-serif;font-size:16px;text-align:left;"> <h2 style="mso-line-height-rule:exactly;line-height:30px;text-align:center;color:rgb(51,51,51);font-size:24px;font-family:sans-serif;margin-top:0px;margin-bottom:0px;"> <span style="color:rgb(0, 0, 0);font-size:30px;">Thank You</span> </h2> </div> </td> </tr> </tbody> </table> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(255,255,255);"> <tbody> <tr> <td style="background-color:rgb(255,255,255);padding:15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" style="width:100%;"> <tbody> <tr> <td> <div data-fusion-class="" style="margin:0px;padding:0px;border-color:transparent;border-width:0px;border-style:none;background-color:transparent;display:block;color:rgb(51,51,51);font-family:sans-serif;font-size:16px;text-align:left;"> <p style="margin-top:0px;margin-bottom:0px;"> <strong style="font-size:14px;color:rgb(0, 0, 0);">Hi '+name+' ,</strong><br><span style="font-size:14px;color:rgb(0, 0, 0);">&nbsp;We just need to verify your email address before you can access 9Estate.Verify your email address click below button.</span> </p> </div> </td> </tr> </tbody> </table> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(255,255,255);"> <tbody> <tr> <td style="background-color:rgb(255,255,255);padding:15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <div data-fusion-class="" style="overflow:hidden;background:transparent;"> <table cellpadding="0" cellspacing="0" border="0" style="width:100%;"> <tbody> <tr> <td style="padding:0px;"> <table cellpadding="0" cellspacing="0" align="center" style="margin:0px auto;"> <tbody> <tr> <td style="text-align:center;background:rgb(92, 184, 92);border-radius:4px;border-color:transparent;border-style:none;border-width:0px;padding:10px 20px;"> <a href="'+pathUrl+'" name="unlinked-0khypwo" style="text-decoration:none;color:rgb(255,255,255);font-family:sans-serif;font-size:16px;" id="unlinked-0khypwo">Verify Email</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(255,255,255);"> <tbody> <tr> <td style="background-color:rgb(255,255,255);padding:3px 15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" style="width:100%;"> <tbody> <tr> <td> <div data-fusion-class="" style="margin:0px;padding:0px;border-color:transparent;border-width:0px;border-style:none;background-color:transparent;display:block;color:rgb(51,51,51);font-family:sans-serif;font-size:16px;text-align:left;"> <p style="margin-top:0px;margin-bottom:0px;"> <strong>Thanks & Regards</strong> </p> </div> </td> </tr> </tbody> </table> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(255,255,255);"> <tbody> <tr> <td style="background-color:rgb(255,255,255);padding:0px 15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" style="width:100%;"> <tbody> <tr> <td> <div data-fusion-class="" style="margin:0px;padding:0px;border-color:transparent;border-width:0px;border-style:none;background-color:transparent;display:block;color:rgb(51,51,51);font-family:sans-serif;font-size:16px;text-align:left;"> <p style="margin-top:0px;margin-bottom:0px;"> Team 9Estate</p> </div> </td> </tr> </tbody> </table> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(255,255,255);"> <tbody> <tr> <td style="background-color:rgb(255,255,255);padding:15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;"> <tbody> <tr> <td style="padding-top:10px;padding-bottom:10px;"> <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0px auto;width:100%;"> <tbody> <tr> <td style="mso-line-height-rule:exactly;font-size:0px;line-height:0px;border-bottom:1px solid rgb(136,136,136);"> &nbsp; </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(25,118,210);"> <tbody> <tr> <td style="background-color:rgb(25,118,210);padding:12px 15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:255px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" style="width:100%;"> </body>', 
  });
  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
// Send email reset password
async function resetPasswordmail(email,name,pathUrl) {
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: process.env.host,
    port: process.env.port,
    secure: process.env.secure,
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });
  let info = await transporter.sendMail({
    from: 'sales@avitronmailer.ga',
    to: email,
    subject: "9Estate - Forgot Password",
    text: "Forgot Password.",
    html: '<head> <!--[if gte mso 15]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> <![endif]--> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,500,500i,700,700i" rel="stylesheet"><!--<![endif]--> <title></title> </head> <body> <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0px auto;"> <tbody> <tr> <td class="fusionResponsiveCanvas" valign="top" style="width:100%;padding-top:15px;padding-bottom:15px;background-color:rgb(246,246,246);background-repeat:no-repeat;font-family:sans-serif;"> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(25,118,210);"> <tbody> <tr> <td style="background-color:rgb(25,118,210);padding:7px 15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <div data-aqa="block-image" style="overflow:hidden;"> <table cellpadding="0" cellspacing="0" border="0" style="width:100%;"> <tbody> <tr> <td class="null" style="padding:0px 0px 20px;"> <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin:auto;width:59%;"> <tbody> <tr> <th style="display:block;border-color:transparent;border-style:none;border-width:0px;"> <img src="https://i.imgur.com/HRvqyP2.png" class="fusionResponsiveImage" alt="" width="318" height="auto" style="display:block;width:318px;height:auto;margin:auto;background-color:transparent;"> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(255,255,255);"> <tbody> <tr> <td style="background-color:rgb(255,255,255);padding:15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;"> <tbody> <tr> <td style="padding-top:10px;padding-bottom:10px;"> <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0px auto;width:100%;"> <tbody> <tr> <td style="mso-line-height-rule:exactly;font-size:0px;line-height:0px;border-bottom:1px solid rgb(136,136,136);"> &nbsp; </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(255,255,255);"> <tbody> <tr> <td style="background-color:rgb(255,255,255);padding:15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" style="width:100%;"> <tbody> <tr> <td> <div data-fusion-class="" style="margin:0px;padding:0px;border-color:transparent;border-width:0px;border-style:none;background-color:transparent;display:block;color:rgb(51,51,51);font-family:sans-serif;font-size:16px;text-align:left;"> <h2 style="mso-line-height-rule:exactly;line-height:30px;text-align:center;color:rgb(51,51,51);font-size:24px;font-family:sans-serif;margin-top:0px;margin-bottom:0px;"> <span style="color:rgb(0, 0, 0);font-size:30px;">Reset Your Password.</span> </h2> </div> </td> </tr> </tbody> </table> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(255,255,255);"> <tbody> <tr> <td style="background-color:rgb(255,255,255);padding:15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" style="width:100%;"> <tbody> <tr> <td> <div data-fusion-class="" style="margin:0px;padding:0px;border-color:transparent;border-width:0px;border-style:none;background-color:transparent;display:block;color:rgb(51,51,51);font-family:sans-serif;font-size:16px;text-align:left;"> <p style="margin-top:0px;margin-bottom:0px;"> <strong style="font-size:14px;color:rgb(0, 0, 0);">Hi '+name+',</strong><br><span style="font-size:14px;color:rgb(0, 0, 0);">&nbsp;We received a request to reset the password for your account.<br>To reset your password, click on the button below.</span> </p> </div> </td> </tr> </tbody> </table> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(255,255,255);"> <tbody> <tr> <td style="background-color:rgb(255,255,255);padding:15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <div data-fusion-class="" style="overflow:hidden;background:transparent;"> <table cellpadding="0" cellspacing="0" border="0" style="width:100%;"> <tbody> <tr> <td style="padding:0px;"> <table cellpadding="0" cellspacing="0" align="center" style="margin:0px auto;"> <tbody> <tr> <td style="text-align:center;background:rgb(83,109,254,1.0);border-radius:4px;border-color:transparent;border-style:none;border-width:0px;padding:10px 20px;"> <a href="'+pathUrl+'" name="unlinked-0khypwo" style="text-decoration:none;color:rgb(255,255,255);font-family:sans-serif;font-size:16px;" id="unlinked-0khypwo">Reset Your Password</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(255,255,255);"> <tbody> <tr> <td style="background-color:rgb(255,255,255);padding:3px 15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" style="width:100%;"> <tbody> <tr> <td> <div data-fusion-class="" style="margin:0px;padding:0px;border-color:transparent;border-width:0px;border-style:none;background-color:transparent;display:block;color:rgb(51,51,51);font-family:sans-serif;font-size:16px;text-align:left;"> <p style="margin-top:0px;margin-bottom:0px;"> <strong>Thanks & Regards</strong> </p> </div> </td> </tr> </tbody> </table> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(255,255,255);"> <tbody> <tr> <td style="background-color:rgb(255,255,255);padding:0px 15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" style="width:100%;"> <tbody> <tr> <td> <div data-fusion-class="" style="margin:0px;padding:0px;border-color:transparent;border-width:0px;border-style:none;background-color:transparent;display:block;color:rgb(51,51,51);font-family:sans-serif;font-size:16px;text-align:left;"> <p style="margin-top:0px;margin-bottom:0px;"> Team 9Estate </p> </div> </td> </tr> </tbody> </table> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(255,255,255);"> <tbody> <tr> <td style="background-color:rgb(255,255,255);padding:15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:540px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;"> <tbody> <tr> <td style="padding-top:10px;padding-bottom:10px;"> <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0px auto;width:100%;"> <tbody> <tr> <td style="mso-line-height-rule:exactly;font-size:0px;line-height:0px;border-bottom:1px solid rgb(136,136,136);"> &nbsp; </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </th> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" border="0" data-fusion-class="" style="width:100%;margin:0px auto;"> <tbody> <tr> <td valign="top" style="width:100%;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0px auto;width:600px;table-layout:fixed;background-color:rgb(25,118,210);"> <tbody> <tr> <td style="background-color:rgb(25,118,210);padding:12px 15px;border-color:transparent;border-width:0px;border-style:none;"> <table class="fusionResponsiveContent" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;"> <tbody> <tr> <th class="fusionResponsiveColumn" style="mso-line-height-rule:exactly;width:15px;line-height:0;font-size:0px;"> <!--[if !mso]><!--><img src="https://ui.icontact.com/assets/1px.png" class="css-fisw11" width="1" border="0" style="display: block;"><!--<![endif]--> </th> <th valign="top" class="fusionResponsiveColumn" data-fusion-class="" style="width:255px;background-color:transparent;padding:0px;border-color:transparent;border-style:none;border-width:0px;transition:all 0.2s ease 0s;"> <table cellpadding="0" cellspacing="0" style="width:100%;"> </body>', 
  });
  
  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
 // Get User Account menu 
 router.get('/useraccounts', async (req, res, next) => {
  try {
    var currentuserid = String(req.query.storage_data);
    const data = await Account.find({ _id : currentuserid,role:"2" })
    const total_accounts = await Account.countDocuments({ _id : currentuserid,role:"2" });
    res.send({
      total: total_accounts,
      accounts: data,
    });
  }
  catch (error) {
    next(error)
  }
})

 // Get Agent Account menu 
 router.get('/agentaccounts', async (req, res, next) => {
  try {
    var currentuserid = String(req.query.storage_data);
    const data = await Account.find({ _id : currentuserid ,role: { $in : ["1", "3"]}})
    const total_accounts = await Account.countDocuments({ _id : currentuserid,role: { $in : ["1", "3"]}});
    res.send({
      total: total_accounts,
      accounts: data,
    });
  }
  catch (error) {
    next(error)
  }
})

//Change User password
router.get('/userchengepassword', async (req, res, next) => {
  try {
    const user_id= req.query.user_id;
    const find = await Account.findOne({ _id: user_id });
    const salt = await bcrypt.genSalt(10);
    const newpassword = await bcrypt.hash(req.query.cnfpassword, salt);
    if (find) {
      const option = { new: true };
      const updatedDetails = await Account.findByIdAndUpdate(find._id, {password
        :newpassword}, option);
    
      res.send({status:1});
    } else {
      res.send({status:0});
    }
  } catch (error) {
   next(error)
  }
});
//agntresetpassword
router.get('/agntresetpassword', async (req, res, next) => {
  try {
    const password = req.query.password;
    const encoded_email = req.query.encoded_email;
    const find = await Account.findOne({ verification: encoded_email });
    const salt = await bcrypt.genSalt(10);
    const newpassword = await bcrypt.hash(password, salt);
    if (find) {
      const option = { new: true };
      const updatedDetails = await Account.findByIdAndUpdate(find._id, {password
        :newpassword, verification:'0', encoded_email:'', emailverify:1}, option);
    
      res.send({status:1});
    } else {
      res.send({status:0});
    }
  } catch (error) {
   next(error)
  }
});

//Change Agent password
router.get('/agntchengepassword', async (req, res, next) => {
  try {
    const agent_id= req.query.agent_id;
    const find = await Account.findOne({ _id: agent_id });
    const salt = await bcrypt.genSalt(10);
    const newpassword = await bcrypt.hash(req.query.cnfpassword, salt);
    if (find) {
      const option = { new: true };
      const updatedDetails = await Account.findByIdAndUpdate(find._id, {password
        :newpassword}, option);
        const data = await Account.find({ _id : find._id});
    
        res.send({status:1, data:data});
    
      
    } else {
      res.send({status:0});
    }
  } catch (error) {
   next(error)
  }
});
//Agent url match
router.get('/agenturlmatch', async (req, res, next) => {
  try {
    const encoded_email = req.query.encoded_email;
    const find = await Account.findOne({ verification: encoded_email });
    if (find) {
      res.send({status:1});
    } else {
      res.send({status:0});
    }
  } catch (error) {
   next(error)
  }
});
//Get Agent Name for enquiry
router.get('/agentName', async (req, res, next) => {
  try {
    const loginid = req.query.loginid;
    const data = await Account.find({_id: loginid})
    const total_data = await Account.countDocuments({_id: loginid});
    res.send({
      total: total_data,
      AgentName: data,
    });
  } catch (error) {
   next(error)
  }
});
router.get('/checkemail', async (req, res, next) => {	
  try {	
    const email = req.query.email;	
    const pathUrl = req.query.pathUrl;	
    const find = await Account.findOne({ email: email });	
     const data = {	
    email: req.query.email,	
    encoded_email:req.query.encoded_email	
  };	
  console.log(data);	
    if (find) {	
        postingForgotPassmail(data);	
      const option = { new: true };	
      const updatedDetails = await Account.findByIdAndUpdate(find._id, {verification	
        :req.query.encoded_email}, option);	
       	
  console.log('data for forgot function ->', data);	
  	
    	
      //resetPasswordmail(email,find.name,pathUrl).catch(console.error);	
      	
      res.send({status:1});	
    } else {	
      res.send({status:0});	
    }	
  } catch (error) {	
   next(error)	
  }	
});
//get Agents Account
router.get('/agentsAccounts', async (req, res, next) => {
  try {
    const data = await Account.find({role:"1"})
    const total_accounts = await Account.countDocuments({role:"1"});
    res.send({
      total: total_accounts,
      accounts: data, 
    });
  }
  catch (error) {
    next(error)
  }
})

//get only verified Account
router.get('/verified_accounts', async (req, res, next) => {
  try {
    const data = await Account.find({role:"1",emailverify:"1"})
    const total_verified_accounts = await Account.countDocuments({role:"1",emailverify:"1"});
    res.send({
      total: total_verified_accounts,
      verified_accounts: data, 
    });
  }
  catch (error) {
    next(error)
  }
})

router.get('/get_any_accounts/:id', async (req, res, next) => {
  try {
    const data = await Account.find({_id:req.params.id});
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//get Account
//get Account
router.get('/account_by_email', async (req, res, next) => {
  try {
    var email = String(req.query.storage_data);
    const total_accounts = await Account.countDocuments({ email :email});
    res.send({
      total: total_accounts
    });
  }
  catch (error) {
    next(error)
  }
})
router.get('/accounts', async (req, res, next) => {
  try {
    console.log('main data');
    const data = await Account.find({role:"1"})
    const total_accounts = await Account.countDocuments({role:"1"});
    res.send({
      total: total_accounts,
      accounts: data, 
    });
  }
  catch (error) {
    next(error)
  }
})
//get Account naya
router.get('/accounts_all_for_admin', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const search = String(req.query.searchdata);
    const skips = limit * offset;
    var sortObject = {};
    var sort_col = String(req.query.sort_col);
    var sort_order = String(req.query.sort_order);
    sortObject[sort_col] = sort_order;
    if (search) {
      const colName = search;
      const accountsCollection = await Account.find({role_type: { "$ne": 'admin' },
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          { email: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Account.countDocuments({role_type: { "$ne": 'admin' },
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          { email: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      });
      res.send({
        total: total_pages,
        accounts: accountsCollection,
      });
    } else {
      const accountCollection = await Account.find({role_type: { "$ne": 'admin' }})
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Account.countDocuments({role_type: { "$ne": 'admin' }});
      res.send({
        total: total_pages,
        accounts: accountCollection,
      });
    }
  } catch (error) {
    next(error);
  }


})
router.get('/accounts_all_for_admin_for_role_id', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const search = String(req.query.searchdata);
    const role = String(req.query.role);
    const skips = limit * offset;
    var sortObject = {};
    var sort_col = String(req.query.sort_col);
    var sort_order = String(req.query.sort_order);
    sortObject[sort_col] = sort_order;
    if (search) {
      const colName = search;
      const accountsCollection = await Account.find({role:role, role_type: { "$ne": 'admin' },
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          { email: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Account.countDocuments({role:role, role_type: { "$ne": 'admin' },
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
          { email: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      });
      res.send({
        total: total_pages,
        accounts: accountsCollection,
      });
    } else {
      const accountCollection = await Account.find({role:role})
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Account.countDocuments({role:role});
      res.send({
        total: total_pages,
        accounts: accountCollection,
      });
    }
  } catch (error) {
    next(error);
  }


})
router.get('/accounts_all_for_subadmin', async (req, res, next) => {
  try {
    const data = await Account.find({role: { "$ne": '0' }})
    const total_accounts = await Account.countDocuments({role_type: { "$ne": 'admin' }});
    res.send({
      total: total_accounts,
      accounts: data, 
    });
  }
  catch (error) {
    next(error)
  }
})
//get Admin Account
router.get('/adminaccounts', async (req, res, next) => {
  try {
    const data = await Account.find({role:"0"})
    const total_accounts = await Account.countDocuments({role:"0"});
    res.send({
      total: total_accounts,
      accounts: data, 
    });
  }
  catch (error) {
    next(error)
  }
})

//get admin details
router.get('/accounts/:adminid',(req, res,next)=>{
 
})
//get admin account for update profile
router.get('/getadminaccounts', async (req, res, next) => {
  try {
    var currentloginid = String(req.query.storage_data);
    const data = await Account.find({ _id : currentloginid,role:"0" })
    const total_accounts = await Account.countDocuments({ _id : currentloginid,role:"0" });
    res.send({
      total: total_accounts,
      accounts: data,
    });
  }
  catch (error) {
    next(error)
  }
});
router.get('/agent/checkuserName/:username', async (req, res, next) => {
  try {
    const data = await Account.find({uname:req.params.username})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
router.get('/agent/checkuserNameNew/:username', async (req, res, next) => {
  try {
    const data = await Account.find({username:req.params.username})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//Update Admin Account
router.patch("/admin_update/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Account.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Change Admin password to admin profile page
router.get('/adminchengepassword', async (req, res, next) => {
  try {
    const admin_id= req.query.admin_id;
    const find = await Account.findOne({ _id: admin_id});
    const salt = await bcrypt.genSalt(10);
    const newpassword = await bcrypt.hash(req.query.cnfpassword, salt);
    if (find) {
      const option = { new: true };
      const updatedDetails = await Account.findByIdAndUpdate(find._id, {password
        :newpassword}, option);
        const data = await Account.find({ _id : find._id});
    
        res.send({status:1, data:data});
    
      
    } else {
      res.send({status:0});
    }
  } catch (error) {
   next(error)
  }
});
router.post("/checkadminlogin", async (req, res, next) => {
  try {
    const email = String(req.body.uname);
    const password = String(req.body.password);
    const find = await Account.findOne( {
      $or:[{email:String(req.body.uname), role:"0"},{username:String(req.body.uname), role:"0"}]
    });
   
    if (find === null) {
      res.send({status:0});
    } else {

      const trueUser = await bcrypt.compare(password, find.password);
      console.log('login response password ->', trueUser);
      if(trueUser==false){
          res.send({status:0});
      }else{
          res.send({
          id: find._id,
          userId: find.username,
          role: find.role,
          role_type: find.role_type,
          status:1
        });
      }
    }
  } catch (error) {
    
    next(error);
  }
})
// Agent verification
router.get("/agentemailverification", async (req, res, next) => {
   try {
    const email = String(req.query.encoded_email);
    const find = await Account.findOne({ encoded_email:email });
    if (find === null) {
         res.send({status:0});
    } else {
        const update = {encoded_email:'', emailverify:1};
        const id = find.id;
        const option = { new: true };
        const updatedDetails = await Account.findByIdAndUpdate(id, update, option);
        res.send({status:1});

    }
  } catch (error) {
     next(error);
   }
})
//Search admin account
router.get("/getadminaccountssearch", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const search = String(req.query.searchdata);
    const skips = limit * offset;
    var sortObject = {};
    var sort_col = String(req.query.sort_col);
    var sort_order = String(req.query.sort_order);
    sortObject[sort_col] = sort_order;
    if (search) {
      const colName = search;
      const accountsCollection = await Account.find({role:"0",
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Account.countDocuments({role:"0",
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: accountsCollection,
      });
    } else {
      const accountCollection = await Account.find({role:"0"})
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Account.countDocuments({role:"0"});
      res.send({
        total: total_pages,
        data: accountCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//Search agent account

router.get('/checkEmail_url', async (req, res, next) => {
  try {
    const email = req.query.email;
    const find = await Account.findOne({ email: email });
    if (find) {
      res.send({ data: find });
    }else{
      res.send({ data:'0' });
    }
  } catch (error) {
   next(error)
  }
});


router.get('/agent/checkurl/:slug/:slug_url', async (req, res, next) => {
  try {
    const data = await Account.find({slug_url:req.params.slug+'/'+req.params.slug_url})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
router.get("/getaccountssearch", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const search = String(req.query.searchdata);
    const skips = limit * offset;
    var sortObject = {};
    var sort_col = String(req.query.sort_col);
    var sort_order = String(req.query.sort_order);
    sortObject[sort_col] = sort_order;
    if (search) {
      const colName = search;
      const accountsCollection = await Account.find({role:"1",
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Account.countDocuments({role:"1",
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: accountsCollection,
      });
    } else {
      const accountCollection = await Account.find({role:"1"})
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Account.countDocuments({role:"1"});
      res.send({
        total: total_pages,
        data: accountCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get Account by ID
router.get('/accounts/:id', async (req, res, next) => {

  try {
    const data = await Account.find({_id:req.params.id,role:"1"});
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//Create Account
router.post("/accounts", async (req, res, next) => {
   main(req.body.email,req.body.name,req.body.pathUrl).catch(console.error);
  try {
    
    const salt = await bcrypt.genSalt(10);
    const newpassword = await bcrypt.hash(req.body.password, salt);
    const accountsave = new Account({
        company_id:req.body.company_id,
        name:req.body.name,
        mobile:req.body.mobile,
        email:req.body.email,
        password:newpassword,
        description:req.body.description,
        role:req.body.role,
        emailverify:req.body.emailverify,
        encoded_email:req.body.encoded_email,
        join_dt:req.body.join_dt,
        update_dt:req.body.update_dt,
        status:req.body.status
    });
    const addaccount = await accountsave.save();
    res.send(addaccount);
  } catch (error) {
    next(error);
  }
});
//create new
router.post("/accounts_new", async (req, res, next) => {
  main(req.body.email,req.body.name,req.body.pathUrl).catch(console.error);
 try {
   
   const salt = await bcrypt.genSalt(10);
   const newpassword = await bcrypt.hash(req.body.password, salt);
   var addaccount = '';
   if(req.body.role_type!='subadmin'){
	   const accountsave = new Account({
		   company_id:req.body.company_id,
		   name:req.body.name,
			lname:req.body.lname,
		   mobile:req.body.mobile,
		   email:req.body.email,
		   password:newpassword,
		   description:req.body.description,
		   role:req.body.role,
		   role_type:req.body.role_type,
		   emailverify:req.body.emailverify,
		   encoded_email:req.body.encoded_email,
		   join_dt:req.body.join_dt,
		   update_dt:req.body.update_dt,
		   status:req.body.status,
		   username:req.body.username,
		   uname:req.body.uname,
		   emailverify:1,
		   verification:1
	   });
	   const addaccount = await accountsave.save();
   }else{
	   const accountsave = new Account({
        company_id:req.body.company_id,
        name:req.body.name,
        last_name:req.body.lname,
        mobile:req.body.mobile,
        email:req.body.email,
        password:newpassword,
        description:req.body.description,
        role:req.body.role,
        role_type:req.body.role_type,
        emailverify:req.body.emailverify,
        encoded_email:req.body.encoded_email,
        join_dt:req.body.join_dt,
        update_dt:req.body.update_dt,
        status:req.body.status,
		username:req.body.username,
		uname:req.body.uname
	   });
	   const addaccount = await accountsave.save();
   }
   
   if(req.body.role_type=='subadmin'){
      const prop_permissions_save = new RolePermissons({
        user_id:addaccount._id,
        role:'subadmin',
        permissions_section:'properties',
        permission_view:true,
        permission_add:true,
        permission_edit:true,
        permission_trash:true,
        permission_delete:false,
      });
      const prop_permissions_data = await prop_permissions_save.save();

      const master_permissions_save = new RolePermissons({
        user_id:addaccount._id,
        role:'subadmin',
        permissions_section:'master_forms',
        permission_view:true,
        permission_add:true,
        permission_edit:true,
        permission_trash:true,
        permission_delete:false,
      });
      const master_permissions_data = await master_permissions_save.save();

      const users_permissions_save = new RolePermissons({
        user_id:addaccount._id,
        role:'subadmin',
        permissions_section:'users',
        permission_view:true,
        permission_add:true,
        permission_edit:true,
        permission_trash:true,
        permission_delete:false,
      });
      const users_data = await users_permissions_save.save();

      const enquiries_save = new RolePermissons({
        user_id:addaccount._id,
        role:'subadmin',
        permissions_section:'enquiries',
        permission_view:true,
        permission_add:true,
        permission_edit:true,
        permission_trash:true,
        permission_delete:false,
      });
      const enquiries_data = await enquiries_save.save();

      const contact_save = new RolePermissons({
        user_id:addaccount._id,
        role:'subadmin',
        permissions_section:'contact',
        permission_view:true,
        permission_add:true,
        permission_edit:true,
        permission_trash:true,
        permission_delete:false,
      });
      const contact_data = await contact_save.save();

      const feedback_save = new RolePermissons({
        user_id:addaccount._id,
        role:'subadmin',
        permissions_section:'feedback',
        permission_view:true,
        permission_add:true,
        permission_edit:true,
        permission_trash:true,
        permission_delete:false,
      });
      const feedback_data = await feedback_save.save();

      const subscriptions_save = new RolePermissons({
        user_id:addaccount._id,
        role:'subadmin',
        permissions_section:'subscriptions',
        permission_view:true,
        permission_add:true,
        permission_edit:true,
        permission_trash:true,
        permission_delete:false,
      });
      const subscriptions_data = await subscriptions_save.save();

      const testimonial_save = new RolePermissons({
        user_id:addaccount._id,
        role:'subadmin',
        permissions_section:'testimonial',
        permission_view:true,
        permission_add:true,
        permission_edit:true,
        permission_trash:true,
        permission_delete:false,
      });
      const testimonial_data = await testimonial_save.save();


      const setting_save = new RolePermissons({
        user_id:addaccount._id,
        role:'subadmin',
        permissions_section:'setting',
        permission_view:true,
        permission_add:true,
        permission_edit:true,
        permission_trash:true,
        permission_delete:false,
      });
      const setting_data = await setting_save.save();

      const blog_save = new RolePermissons({
        user_id:addaccount._id,
        role:'subadmin',
        permissions_section:'blog',
        permission_view:true,
        permission_add:true,
        permission_edit:true,
        permission_trash:true,
        permission_delete:false,
      });
      const blog_data = await blog_save.save();

      const cms_save = new RolePermissons({
        user_id:addaccount._id,
        role:'subadmin',
        permissions_section:'cms',
        permission_view:true,
        permission_add:true,
        permission_edit:true,
        permission_trash:true,
        permission_delete:false,
      });
      const cms_data = await cms_save.save();
   }
   res.send(addaccount);
 } catch (error) {
   next(error);
 }
});
//Update Account
router.patch("/accounts/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Account.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
//Delete Account
router.delete("/accounts/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Account.findOne({ _id: id });
    if (find) {
      const deleted = await Account.findByIdAndDelete({ _id: id });
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }

});
// ===================================================
                    //route for agent
// ===================================================
//get Account
router.get('/agentaccounts', async (req, res, next) => {
  try {
    var currentloginid = String(req.query.storage_data);
    const data = await Account.find({ _id : currentloginid,role:"1" })
    const total_accounts = await Account.countDocuments({ _id : currentloginid,role:"1" });
    res.send({
      total: total_accounts,
      accounts: data,
    });
  }
  catch (error) {
    next(error)
  }
})

//get user account details
router.get('/totaluseraccounts', async (req, res, next) => {
  try {
    const data = await Account.find({role:"2" })
    const total_accounts = await Account.countDocuments({role:"2" });
    res.send({
      total: total_accounts,
    });
  }
  catch (error) {
    next(error)
  }
})

//get owner account detais

router.get('/owneraccounts', async (req, res, next) => {
  try {
    const data = await Account.find({role:"3" })
    const total_accounts = await Account.countDocuments({role:"3" });
    res.send({
      total: total_accounts,
    });
  }
  catch (error) {
    next(error)
  }
})

//get user account detais

router.get('/useraccounts', async (req, res, next) => {
  try {
    var currentloginid = String(req.query.storage_data);
    const data = await Account.find({ _id : currentloginid,role:"2" })
    const total_accounts = await Account.countDocuments({ _id : currentloginid,role:"2" });
    res.send({
      total: total_accounts,
      accounts: data,
    });
  }
  catch (error) {
    next(error)
  }
})

router.post("/checkagentlogin", async (req, res, next) => {
  try {
    const email = String(req.body.uname);
    const password = String(req.body.password);
    //checking username for login
    const find = await Account.findOne({ email:String(req.body.uname), role: { $in : ["1", "2","3"]}});
    if (find === null) {
      //checking email for login
      const find2 = await Account.findOne({ username:String(req.body.uname), role: { $in : ["1", "2","3"]}});
      if (find2 === null) {
        res.send({status:0});
      } else {
        if(find2.status==0){
          res.send({status:4});
        }else{
        const trueUser = await bcrypt.compare(password, find2.password);
          if(trueUser==false){
              res.send({status:2});
          }else{
            if(find2.emailverify==1){
              res.send({
                id: find2._id,
                userId: find2.email,
                role: find2.role,
                status:1
              });
            }else{
              res.send({status:3});
            }
            
          }
        }
      }
    } 
    else {
      const trueUser = await bcrypt.compare(password, find.password);
      if(trueUser==false){
          res.send({status:2});
      }else{
        if(find.status==0){
          res.send({status:4});
        }else{
          if(find.emailverify==1){
            res.send({
              id: find._id,
              userId: find.uname,
              role: find.role,
              status:1
            });
          }else{
            res.send({status:3});
          }
        }
      }
    }
  } catch (error) {
    
    next(error);
  }
})
router.get("/getagentaccountssearch", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const search = String(req.query.searchdata);
    const skips = limit * offset;
    var sortObject = {};
    var sort_col = String(req.query.sort_col);
    var sort_order = String(req.query.sort_order);
    sortObject[sort_col] = sort_order;
    if (search) {
      const colName = search;
      const accountsCollection = await Account.find({role:"1",
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
        ],
      })
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Account.countDocuments({role:"1",
        $or: [
          { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
        ],
      });
      res.send({
        total: total_pages,
        data: accountsCollection,
      });
    } else {
      const accountCollection = await Account.find({role:"1"})
        .skip(skips)
        .limit(limit)
        .sort(sortObject);
      const total_pages = await Account.countDocuments({role:"1"});
      res.send({
        total: total_pages,
        data: accountCollection,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get Account by ID
router.get('/accounts/:id', async (req, res, next) => {

  try {
    const data = await Account.find({_id:req.params.id})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//Create Account
router.post("/accounts", async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const newpassword = await bcrypt.hash(req.body.password, salt);
    const accountsave = new Account({
        company_id:req.body.company_id,
        name:req.body.name,
        mobile:req.body.mobile,
        email:req.body.email,
        password:newpassword,
        description:req.body.description,
        role:req.body.role,
        join_dt:req.body.join_dt,
        update_dt:req.body.update_dt,
        status:req.body.status
    });
    const addaccount = await accountsave.save();
    res.send(addaccount);
  } catch (error) {
    next(error);
  }
});
//Create Account
router.post("/accountsNewSave", async (req, res, next) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    username:req.body.username,
    path_url:req.body.encoded_email
  };
  
  postDatamail(data);
  //main(req.body.email,req.body.name,req.body.pathUrl).catch(console.error);
  try {
    
    const salt = await bcrypt.genSalt(10);
    const newpassword = await bcrypt.hash(req.body.password, salt);
    const accountsave = new Account({
        name:req.body.name,
        mobile:req.body.mobile,
        email:req.body.email,
        username:req.body.username,
        password:newpassword,
        description:req.body.description,
        role:req.body.role,
        emailverify:req.body.emailverify,
        encoded_email:req.body.encoded_email,
        slug:req.body.slug,
        slug_url:req.body.slug_url,
        join_dt:req.body.join_dt,
        update_dt:req.body.update_dt,
        status:req.body.status
    });
    const addaccount = await accountsave.save();
    res.send(addaccount);
  } catch (error) {
    next(error);
  }
});
//Update Account
router.patch("/agentupdateaccounts/:id", async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const option = { new: true };
    const updatedDetails = await Account.findByIdAndUpdate(id, update, option);
    res.send(updatedDetails);
  } catch (error) {
    next(error);
  }
});
router.get('/getagentbyid/:id', async (req, res, next) => {
  try {
    const data = await Account.find({_id:req.params.id})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
router.get('/getagentbySlug/:slug', async (req, res, next) => {
  try {
    const data = await Account.find({slug:req.params.slug})
    res.send({ data: data })
  }
  catch (error) {
    next(error)
  }
})
//Delete Account
router.delete("/agentsaccounts/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const find = await Account.findOne({ _id: id });
    if (find) {
      const deleted = await Account.findByIdAndDelete({ _id: id});
      res.send(deleted);
    } else {
      res.send("Id does not exist");
    }
  } catch (error) {
   next(error)
  }
});
module.exports = router;