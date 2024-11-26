import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

export const invokeLambdaFunction = async (
  lambdaArn: string,
  userEmail: string,
  organizationId: string
): Promise<void> => {
  const lambdaClient = new LambdaClient({});
  const payload = { userEmail, organizationId };

  try {
    const command = new InvokeCommand({
      FunctionName: lambdaArn,
      Payload: Buffer.from(JSON.stringify(payload)),
    });

    const response = await lambdaClient.send(command);

    if (response.Payload) {
      const responseData = JSON.parse(Buffer.from(response.Payload).toString());
      console.log("Lambda Response:", responseData);
    } else {
      console.log("No payload returned from Lambda function.");
    }
  } catch (error) {
    console.error("Error invoking Lambda function:", error);
  }
};

// Example usage
(async () => {
  const lambdaArn =
    "arn:aws:lambda:region:account-id:function:your-lambda-function-name";
  const userEmail = "example@example.com";
  const organizationId = "org-1234";

  await invokeLambdaFunction(lambdaArn, userEmail, organizationId);
})();
