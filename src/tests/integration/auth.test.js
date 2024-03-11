import {faker} from "@faker-js/faker";
import setUpTestDb from "../utils/setUpTestDB"
import request from 'supertest'
import app from "../../app";
import { Profile } from "../../components/profile";
import helpers from "../../utils/helpers";
import { Users } from "../../components/users";
import userFixture from '../fixtures/user.fixture'
setUpTestDb()
describe('Auth Routes',()=>{
    describe('POST - /auth/register',()=>{
      let newUser;
      beforeEach(()=>{
        newUser={
            name:faker.person.fullName(),
            email:faker.internet.email(),
            username:faker.internet.userName(),
            password:"Password123"
        }
      }) 
      
      
      it('when request is ok, should return 201 and successfully registered user',async ()=>{
        const res = await request(app).post('/api/auth/register').send(newUser) 
        expect(res.statusCode).toEqual(201)   
        expect(res.body.data.user).not.toHaveProperty('password') 
        expect(res.body.data.user).toMatchObject({
          _id:expect.anything(),
          name:newUser.name,
          email:newUser.email.toLowerCase(),
          role:'user',
          username:helpers.formatUserName(newUser.username),
          createdAt:expect.anything(),
          updatedAt:expect.anything()
        })

        expect(res.body.data.accessToken).toBeDefined()      
        const {_id:userId} =  res.body.data.user
        const [dbUser,profileData]  =  await Promise.all([Users.findById(userId),Profile.findOne({user:userId})])
        expect(dbUser._id.toString()).toBe(userId)
        expect(profileData.user.toString()).toBe(userId)
      })


      it('when email is invalid, should return error',async ()=>{
        newUser.email='invalid';
        const user = await request(app).post('/api/auth/register').send(newUser)
        expect(user.body.error.data.status).toBe(422)
      })


      test("password length must be greater then 8 characters, should return error",async ()=>{
        newUser.password="Passw12"
        const user = await request(app).post('/api/auth/register').send(newUser)
        expect(user.body.error.data.status).toBe(422)
      })

      test("password should contain alteast one digit one number, should return error",async ()=>{
        newUser.password="PasswordChauhan"
        const res = await request(app).post('/api/auth/register').send(newUser)
        expect(res.body.error.data.status).toBe(422)
        // expect(res.body.error.data.message).toBe('password must contains aleast 1 letter in caps,and 1 in small and 1 number')
      })

      test('when email is already in use, should return error',async ()=>{
        await userFixture.insertUser([userFixture.userOne])
        newUser.email = userFixture.userOne.email
        const res     = await request(app).post('/api/auth/register').send(newUser) 
        // console.log(res.body.error.data);
        expect(res.body.error.data.status).toBe(400)
        expect(res.body.error.data.message).toBe('Email is already taken.')
      })

      it('when user name is already taken,should return error',async ()=>{
        await userFixture.insertUser([userFixture.userOne])
        newUser.username = userFixture.userOne.username
        const res        = await request(app).post('/api/auth/register').send(newUser)
        expect(res.body.error.data.status).toBe(400)
        expect(res.body.error.data.message).toBe('User Name is already taken.')
      })
    })


    describe('POST -/auth.login',()=>{
      it('when email and password matched, should return user and token',async ()=>{
        await userFixture.insertUser([userFixture.userOne])
        const loginCredentials = {
          username:userFixture.userOne.username,
          password:userFixture.userOne.password
        }
        const res = await request(app).post('/api/auth/login').send(loginCredentials)
        expect(res.statusCode).toBe(200)
        expect(res.body.data.userDetails).not.toHaveProperty('password')
        expect(res.body.data.userDetails).toMatchObject({
          name:userFixture.userOne.name,
          role:'user',
          email:userFixture.userOne.email.toLocaleLowerCase()
        })
        expect(res.body.data.accessToken).toBeDefined()
        expect(res.body.data.refreshToken).toBeDefined()
      })


      it('when email is not found, should be return 400',async()=>{
        const loginCredentials={
          username:userFixture.userOne.email,
          password:userFixture.userOne.password
        }

        const res = await request(app).post('/api/auth/login').send(loginCredentials)
        expect(res.statusCode).toBe(400)
      })


      test('when password is wrong, should be return 400',async()=>{
        await userFixture.insertUser([userFixture.userOne])

        const loginCredentials = {
          username:userFixture.userOne.email,
          password:'WrongPassword@231'
        }

        const res = await request(app).post('/api/auth/login').send(loginCredentials)
        
        expect(res.statusCode).toBe(400)
      })
    })
})