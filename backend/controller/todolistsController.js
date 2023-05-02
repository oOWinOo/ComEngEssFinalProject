const dotenv = require("dotenv");
dotenv.config();
const { v4: uuidv4 } = require("uuid");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  PutCommand,
  DeleteCommand,
  ScanCommand,
  UpdateCommand
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


exports.deleteAssignment = async (req, res) => {
  const userid = req.params.userid;
  const params = {
    TableName: process.env.aws_assignments_table,
    Key: {
      userid: userid
    }
  };

  try {
    await docClient.send(new DeleteCommand(params));
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};



exports.addAssignment = async (req,res) => {
  const user = { userid: req.userid, ...req.body};
  const params = {
    TableName: process.env.aws_assignments_table,
    Item: user,
  };


  try {
    await docClient.send(new PutCommand(params));  
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }

};

exports.updateAssignment = async (req, res) => {
  const new_data = { userid: req.userid, ...req.body};
  const userid = new_data.userid;
  const params = {
    TableName: process.env.aws_assignments_table,
    Key: {
      userid
    },
    UpdateExpression: "SET assignments = :new_data",
    ExpressionAttributeValues: {
      ":new_data": new_data.assignments
    },
    ReturnValues: "UPDATED_NEW"
  };


  try {
    await docClient.send(new UpdateCommand(params));  
    res.status(200).end();
  } catch (err) {
    console.log(new_data);
    console.error(err);
    res.status(500).send(err);
  }
}