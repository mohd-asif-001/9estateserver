const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const dotenv = require('dotenv');
var cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');


//require('dotenv').config();
require("../db/connection");
const app = new express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
      origin: '*'
  }
});
const PropertyRoute = require("./property/routes/property.route");
const CategoryRoute = require("./property/routes/categories.route");
const CityRoute = require("./property/routes/city.route");
const CountryRoute = require("./property/routes/countries.route");
const EnquiryRoute = require("./property/routes/enquiry.route");
const ContactRoute = require("./property/routes/contact.route");
const RegistertRoute = require("./property/routes/register.route");
const FeedbackRoute = require("./property/routes/feedback.route");
const FeatureRoute = require("./property/routes/features.route");
const FacilityRoute = require("./property/routes/facilities.route");
const TagsRoute= require("./property/routes/tags.route");
const testimonialRoute= require("./property/routes/testimonial.route");
const SetsmtpRoute= require("./property/routes/setsmtp.route");
const PropertyTypeRoute= require("./property/routes/propertyType.route");
const AccountRoute = require("./property/routes/account.route");
const Property_statusRoute = require("./property/routes/property_status.route");
const StreetRoute = require("./property/routes/street.route");
const NeighborhoodRoute =require("./property/routes/neighborhood.route");
const ZipcodeRoute = require("./property/routes/zipcode.route");
const pedateRoute =require("./property/routes/pedate.route");
const favoritesRoute=require("./property/routes/favorites.route");
const EnquiryReplyRoute= require('./property/routes/enquiryReply.route');
const AgentContactRoute=require('./property/routes/agentcontact.route');
const AboutcompanyRoute=require('./property/routes/aboutcompany.route');
const OurVisionRoute=require('./property/routes/our_vision.route');
const OurStoryRoute=require('./property/routes/our_story.route');
const OurMissionRoute=require('./property/routes/our_mission.route');
const OurClientRoute=require('./property/routes/our_clients.route');
const OurServiceRoute=require('./property/routes/our_services.route');
const planRoute = require("./property/routes/plan.route");
const couponRoute = require("./property/routes/couponcode.route");
const FaqRoute=require('./property/routes/faqAgent.route');
const AgentPlanRoute=require('./property/routes/agent_plans.route');
const SubscriptionRoute=require('./property/routes/subscriptions.route');
const NewPostRoute=require('./property/routes/new_post.route');
const postCategoryRoute=require('./property/routes/post-category.route');
const postTagRoute=require('./property/routes/post-tags.route');
const CommentRoute = require("./property/routes/comments.route");
const RolePermissonsRoute = require("./property/routes/role_permissions.route");
const RatingRoute = require("./property/routes/rating.route");
const NotificationsRoute = require("./property/routes/notifications.route");
const Quickluckydraw = require("./property/routes/quickluckydraw.route");
const PostRightbar = require("./property/routes/post_rightBar.route");
const HomeRoute = require("./property/routes/homemeta.route");
const PageRoute = require("./property/routes/pagemeta.route");

app.use(express.static(path.join(__dirname + "/uploads")))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
// parse application/json
app.use(bodyParser.json())
app.use(express.json());
app.use(
  PropertyRoute,
  CategoryRoute,
  CityRoute,
  CountryRoute,
  EnquiryRoute,
  ContactRoute,
  FeedbackRoute,
  FeatureRoute,
  AccountRoute,
  Property_statusRoute,
  TagsRoute,
  PropertyTypeRoute,
  FacilityRoute,
  StreetRoute,
  RegistertRoute,
  SetsmtpRoute,
  testimonialRoute,
  pedateRoute,
  NeighborhoodRoute,
  ZipcodeRoute,
  favoritesRoute,
  EnquiryReplyRoute,
  AgentContactRoute,
  AboutcompanyRoute,
  OurVisionRoute,
  OurStoryRoute,
  OurMissionRoute,
  OurClientRoute,
  OurServiceRoute,
  AgentPlanRoute,
planRoute,
couponRoute,
FaqRoute,
  SubscriptionRoute,
  NewPostRoute,
  postCategoryRoute,
  postTagRoute,
  CommentRoute,
  RolePermissonsRoute,
  RatingRoute,
  NotificationsRoute,
  Quickluckydraw,
  PostRightbar,
  HomeRoute,
  PageRoute
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var storage = multer.diskStorage({
  // destination
  destination: function (req, file, cb) {
    //cb(null, '../assets/serverimg')
	 cb(null, '/home/estate/public_html/assets/serverimg')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });
app.post('/api/upload_gallery', upload.array("myFile[]", 12), function (req, res) {
  try {
    res.status(200).json('success');
    //res.send(req.files);
  } catch (error) {
    //console.log(error);
    res.send(400);
  }
  
});
let userList = new Map();
let userEnquiryMap = new Map();

io.on('connection', (socket) => {
  let userName = socket.handshake.query.userName;
  let enquiryId = socket.handshake.query.enquiryId;
  
  console.log('ok hello ->', enquiryId);
  
  //const find = await EnquiryReply.findOne({ enq_id: enq_id });

  addUser(userName, socket.id);

  socket.broadcast.emit('user-list', [...userList.keys()]);
  socket.emit('user-list', [...userList.keys()]);

  const chatRoom = enquiryId;

  socket.join(chatRoom);

  // Notify the user and the other user that they are now in a chat
  notifyUserAndChatPartners(userName, chatRoom);

  socket.on('message', (msg) => {
      console.log('live msg : '+enquiryId);
      // Broadcast the message only to users in the same chat room
      //io.to(chatRoom).emit('message-broadcast', { message: msg, userName: userName });
      socket.broadcast.emit('message-broadcast', {message: msg, userName: userName, enquiry_id:enquiryId});
  });

  socket.on('disconnect', (reason) => {
      removeUser(userName, socket.id);
      socket.leave(chatRoom); // Leave the chat room when a user disconnects
      notifyUserAndChatPartners(userName, chatRoom); // Notify other users in the chat room
  });
});
function addUser(userName, id) {
  if (!userList.has(userName)) {
      userList.set(userName, new Set(id));
  } else {
      userList.get(userName).add(id);
  }
}

function removeUser(userName, id) {
  if (userList.has(userName)) {
      let userIds = userList.get(userName);
      if (userIds.size == 0) {
          userList.delete(userName);
      }
  }
}

function notifyUserAndChatPartners(userName, chatRoom) {
  // Notify the user and their chat partners
  const chatPartners = getChatPartners(userName, chatRoom);
  io.to(chatPartners.map(user => user.id)).emit('chat-partners', chatPartners.map(user => user.userName));
}

function getChatPartners(userName, chatRoom) {
  const chatPartners = [];
  const usersInChatRoom = userEnquiryMap.get(chatRoom) || [];

  if (usersInChatRoom.length <= 2) {
      usersInChatRoom.forEach(user => {
          if (user.userName !== userName) {
              chatPartners.push(user);
          }
      });
  }

  return chatPartners;
}
http.listen(8000, ()=>{
    console.log(`Server Started at ${8000}`)
})
