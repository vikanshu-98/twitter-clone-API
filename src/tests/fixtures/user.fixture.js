import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import auth from "../../utils/auth";
import helper from "../../utils/helpers";
import { Users } from "../../components/users";
const password="Password123"

const userOne={
    _id:mongoose.Types.ObjectId(),
    name:faker.person.fullName(),
    email:faker.internet.email(),
    username:faker.internet.userName(),
    password,
    role:'user',
    avatar:faker.image.url()
}

const userTwo={
    _id:mongoose.Types.ObjectId(),
    name:faker.person.fullName(),
    username:faker.internet.userName(),
    email:faker.internet.email(),
    role:'user',
    password,
    avatar:faker.image.url()
}

const userThree={
    _id:mongoose.Types.ObjectId(),
    name:faker.person.fullName(),
    username:faker.internet.userName(),
    password,
    email:faker.internet.email(),
    avatar:faker.image.url()
}

const admin={
    _id:mongoose.Types.ObjectId(),
    name:faker.person.fullName(),
    email:faker.internet.email(),
    username:faker.internet.userName(),
    password,
    role:'admin',
    avatar:faker.image.url()
}


const insertUser= async (InsertUsers)=>{
    const hashedPassword = await auth.hashedPassword(password) 
    await Users.insertMany(InsertUsers.map((user)=>({...user,password:hashedPassword,username:helper.formatUserName(user.username)})))
}


export default {insertUser,userOne,userTwo,userThree,admin}