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

exports.getTodolists = async (req, res) => {
  const params = {
    TableName: process.env.aws_assignments_table,
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
exports.addAssignment = async (req, res) => {
  const assignment_id = uuidv4();
  const created_date = Date.now();
  const assignment = { assignment_id: assignment_id, ...req.body, created_date: created_date };
  const params = {
    TableName: process.env.aws_assignments_table,
    Item: assignment,
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
exports.deleteAssignment = async (req, res) => {
  const assignment_id = req.params.assignment_id;
  const params = {
    TableName: process.env.aws_assignments_table,
    Key: {
      assignment_id: assignment_id
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
