const dotenv = require("dotenv");
dotenv.config();
const { v4: uuidv4 } = require("uuid");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  PutCommand,
  DeleteCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION });

exports.getGroupMembers = async (req, res) => {
  const params = {
    TableName: process.env.aws_group_members_table_name,
  };
  try {
    const data = await docClient.send(new ScanCommand(params));
    res.send(data.Items);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

// TODO #1.1: Get items from DynamoDB
exports.getItems = async (req, res) => {
  // You should change the response below.
  const params = {
    TableName: process.env.aws_items_table_name,
  };

  try {
    const data = await docClient.send(new ScanCommand(params));
    res.send(data.Items);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

// TODO #1.2: Add an item to DynamoDB
exports.addItem = async (req, res) => {
  const item_id = uuidv4();
  const created_date = Date.now();
  const item = { item_id: item_id, ...req.body, created_date: created_date };
  const params = {
    TableName: process.env.aws_items_table_name,
    Item: item,
  };
  console.log(params)

  // You should change the response below.
  try {
    await docClient.send(new PutCommand(params));  
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

// TODO #1.3: Delete an item from DynamDB
exports.deleteItem = async (req, res) => {
  const item_id = req.params.item_id;
  const params = {
    TableName: process.env.aws_items_table_name,
    Key: {
      item_id: item_id
    }
  };
  // You should change the response below.
  try {
    await docClient.send(new DeleteCommand(params));
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
