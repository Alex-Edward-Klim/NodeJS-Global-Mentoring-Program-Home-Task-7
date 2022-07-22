import request from 'supertest';
import app from './app';
import dataBase from './data-access/dataBase';

import { GroupType } from './types/group';
import { UserType } from './types/user';

describe('Test API on a real DataBase', () => {
  afterAll(() => {
    dataBase.close();
  });

  const token = process.env.TOKEN;

  describe('get all users', () => {
    test('should respond with 200 and contain array of users', async () => {
      const response = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`).send();

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });

  describe('get user by id', () => {
    test('should respond with 200 and contain user data', async () => {
      const response = await request(app).get('/api/users/3df98693-a1dc-4cdf-986e-efe053d40ea4').set('Authorization', `Bearer ${token}`).send();

      expect(response.statusCode).toBe(200);
      expect(response.body.login).toEqual('a');
      expect(response.body.password).toEqual('123xyz');
      expect(response.body.age).toEqual('18');
      expect(response.body.id).toEqual('3df98693-a1dc-4cdf-986e-efe053d40ea4');
    });
  });

  describe('create a user', () => {
    test('should respond with 200 and contain new user data', async () => {
      let login = '';
      for (let i = 0; i < 10; i += 1) login += Math.floor(Math.random() * 10);

      const response = await request(app).post('/api/users').set('Authorization', `Bearer ${token}`).send({
        login,
        password: '123xyz',
        age: 21,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.login).toBeDefined();
      expect(response.body.password).toBeDefined();
      expect(response.body.age).toBeDefined();
      expect(response.body.id).toBeDefined();
    });
  });

  describe('check if user already exists', () => {
    test('should respond with 200 and 400 status code', async () => {
      let login = '';
      for (let i = 0; i < 10; i += 1) login += Math.floor(Math.random() * 10);

      const testApp = request(app);

      const response = await testApp.post('/api/users').set('Authorization', `Bearer ${token}`).send({
        login,
        password: '123xyz',
        age: 21,
      });

      const secondResponse = await testApp.post('/api/users').set('Authorization', `Bearer ${token}`).send({
        login,
        password: '123xyz',
        age: 21,
      });

      expect(response.statusCode).toBe(200);
      expect(secondResponse.statusCode).toBe(400);
    });
  });

  describe('update user by id', () => {
    test('should respond with 200 and contain updated user data', async () => {
      const response = await request(app).patch('/api/users/2b817cd8-c561-43cb-867b-19081e0a31e6').set('Authorization', `Bearer ${token}`).send({
        age: 19,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.age).toEqual('19');
    });
  });

  describe('delete user by id', () => {
    test('should respond with 200 and isDeleted', async () => {
      const { body: usersArr } = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`).send();

      const randomUser = usersArr.find((user: UserType) => user.login.length === 10);
      const { id } = randomUser;

      const response = await request(app).delete(`/api/users/${id}`).set('Authorization', `Bearer ${token}`).send();

      expect(response.statusCode).toBe(200);
      expect(response.text).toEqual('User Deleted');
    });
  });

  describe('get all groups', () => {
    test('should respond with 200 and contain array of groups', async () => {
      const response = await request(app).get('/api/groups').set('Authorization', `Bearer ${token}`).send();

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });

  describe('get group by id', () => {
    test('should respond with 200 and contain group data', async () => {
      const response = await request(app).get('/api/groups/7fc0968e-718b-4945-a0fb-21783145f361').set('Authorization', `Bearer ${token}`).send();

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toEqual('test');
      expect(response.body.permissions).toEqual(['READ', 'WRITE']);
      expect(response.body.users).toEqual([]);
      expect(response.body.id).toEqual('7fc0968e-718b-4945-a0fb-21783145f361');
    });
  });

  describe('create a group', () => {
    test('should respond with 200 and contain new group data', async () => {
      let name = '';
      for (let i = 0; i < 10; i += 1) name += Math.floor(Math.random() * 10);

      const response = await request(app).post('/api/groups').set('Authorization', `Bearer ${token}`).send({
        name,
        permissions: ['READ', 'WRITE'],
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBeDefined();
      expect(response.body.permissions).toBeDefined();
      expect(response.body.id).toBeDefined();
    });
  });

  describe('check if group already exists', () => {
    test('should respond with 200 and 400 status code', async () => {
      let name = '';
      for (let i = 0; i < 10; i += 1) name += Math.floor(Math.random() * 10);

      const testApp = request(app);

      const response = await testApp.post('/api/groups').set('Authorization', `Bearer ${token}`).send({
        name,
        permissions: ['READ', 'WRITE'],
      });

      const secondResponse = await testApp.post('/api/groups').set('Authorization', `Bearer ${token}`).send({
        name,
        permissions: ['READ', 'WRITE'],
      });

      expect(response.statusCode).toBe(200);
      expect(secondResponse.statusCode).toBe(400);
    });
  });

  describe('update group by id', () => {
    test('should respond with 200 and contain updated group data', async () => {
      const response = await request(app).patch('/api/groups/d7be3788-0e91-4f50-bb26-748fde30dcd3').set('Authorization', `Bearer ${token}`).send({
        permissions: ['READ', 'WRITE', 'UPLOAD_FILES'],
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.permissions).toEqual(['READ', 'WRITE', 'UPLOAD_FILES']);
    });
  });

  describe('delete group by id', () => {
    test('should respond with 200 and isDeleted', async () => {
      const { body: groupsArr } = await request(app).get('/api/groups').set('Authorization', `Bearer ${token}`).send();

      const randomGroup = groupsArr.find((group: GroupType) => group.name.length === 10);
      const { id } = randomGroup;

      const response = await request(app).delete(`/api/groups/${id}`).set('Authorization', `Bearer ${token}`).send();

      expect(response.statusCode).toBe(200);
      expect(response.text).toEqual('Group Deleted');
    });
  });
});
