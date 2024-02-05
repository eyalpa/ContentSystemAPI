import * as sinon from 'sinon';

import { createPost, getFeed } from "../../../../api/controllers/postController";
import { Post } from "../../../../models/postModel";
import { User } from "../../../../models/userModel";
import { Status } from '../../../../enums/posts/status';

describe('code snippet', () => {

    // Create a post with valid input data and generate a summary
    it('should create a post with valid input data and generate a summary', async () => {
      // Mock the necessary dependencies
      const req = {
        body: {
          title: 'Lorem ipsum dolor sit amet',
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc id aliquam tincidunt, nisl nunc lacinia nunc, vitae tincidunt nisl mauris id nunc. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi.',
          author: 'user1',
          community: 'community1'
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub()
      };
      const user = {
        _id: 'user1',
        communities: ['community1']
      };
      const post = {
        title: 'Lorem ipsum dolor sit amet',
        summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc id aliquam tincidunt, nisl nunc lacinia nunc, vitae tincidunt nisl mauris id nunc. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi.',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc id aliquam tincidunt, nisl nunc lacinia nunc, vitae tincidunt nisl mauris id nunc. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi.',
        author: 'user1',
        community: 'community1',
        status: Status.PendingApproval
      };
  
      // Stub the necessary functions
      const findByIdStub = sinon.stub(User, 'findById').resolves(user);
      const generateSummaryStub = sinon.stub(utils, 'generateSummary').returns('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc id aliquam tincidunt, nisl nunc lacinia nunc, vitae tincidunt nisl mauris id nunc. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi.');
      const saveStub = sinon.stub(Post.prototype, 'save').resolves(post);
  
      // Invoke the code under test
      await createPost(req, res);
  
      // Assert the expected behavior
      sinon.assert.calledWith(findByIdStub, 'user1');
      sinon.assert.calledWith(generateSummaryStub, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc id aliquam tincidunt, nisl nunc lacinia nunc, vitae tincidunt nisl mauris id nunc. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi.');
      sinon.assert.calledWith(saveStub);
      sinon.assert.calledWith(res.status, 201);
      sinon.assert.calledWith(res.json, post);
    });

    // Create a post with a custom summary
    it('should create a post with a custom summary', async () => {
      // Mock the necessary dependencies
      const req = {
        body: {
          title: 'Lorem ipsum dolor sit amet',
          summary: 'Custom summary',
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          author: 'user1',
          community: 'community1'
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub()
      };
      const user = {
        _id: 'user1',
        communities: ['community1']
      };
      const post = {
        title: 'Lorem ipsum dolor sit amet',
        summary: 'Custom summary',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        author: 'user1',
        community: 'community1',
        status: Status.PendingApproval
      };
  
      // Stub the necessary functions
      const findByIdStub = sinon.stub(User, 'findById').resolves(user);
      const saveStub = sinon.stub(Post.prototype, 'save').resolves(post);
  
      // Invoke the code under test
      await createPost(req, res);
  
      // Assert the expected behavior
      sinon.assert.calledWith(findByIdStub, 'user1');
      sinon.assert.calledWith(saveStub);
      sinon.assert.calledWith(res.status, 201);
      sinon.assert.calledWith(res.json, post);
    });

    // Get the feed of a user with valid input data
    it('should get the feed of a user with valid input data', async () => {
      // Mock the necessary dependencies
      const req = {
        user: {
          _id: 'user1'
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
        json: sinon.stub()
      };
      const user = {
        _id: 'user1',
        communities: ['community1']
      };
      const posts = [
        {
          title: 'Post 1',
          summary: 'Summary 1',
          author: 'user1',
          createdAt: new Date()
        },
        {
          title: 'Post 2',
          summary: 'Summary 2',
          author: 'user2',
          createdAt: new Date()
        }
      ];
  
      // Stub the necessary functions
      const findByIdStub = sinon.stub(User, 'findById').resolves(user);
      const findStub = sinon.stub(Post, 'find').resolves(posts);
  
      // Invoke the code under test
      await getFeed(req, res);
  
      // Assert the expected behavior
      sinon.assert.calledWith(findByIdStub, 'user1');
      sinon.assert.calledWith(findStub, {
        community: { $in: ['community1'] },
        status: Status.Approved
      });
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledWith(res.json, [
        {
          title: 'Post 1',
          summary: 'Summary 1',
          author: 'user1',
          createdAt: posts[0].createdAt
        },
        {
          title: 'Post 2',
          summary: 'Summary 2',
          author: 'user2',
          createdAt: posts[1].createdAt
        }
      ]);
    });

    // Create a post with invalid input data
    it('should not create a post with invalid input data', async () => {
      // Mock the necessary dependencies
      const req = {
        body: {
          title: 123,
          body: 'Lorem ipsum dolor sit amet',
          author: 'user1',
          community: 'community1'
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub()
      };
  
      // Invoke the code under test
      await createPost(req, res);
  
      // Assert the expected behavior
      sinon.assert.calledWith(res.status, 400);
      sinon.assert.calledWith(res.send, 'Invalid input data');
    });
});
