import {Aws, Options} from 'aws-cli-js';

function validateVars() {
    if(!process.env.AWS_SESSION_TOKEN) {
        throw Error('This script needs a valid AWS Session.');
    }else if(!process.env.TIMESTREAM_INSERT_ROLE) {
        throw Error('This script needs a role to allow it to insert into TimeStream.');
    }else if(!process.env.TIMESTREAM_ERROR_LOG_ROLE) {
        throw Error('This script needs a role to allow it to insert into TimeStream.');
    }else if(!process.env.TIMESTREAM_ERROR_LOG_GROUP) {
        throw Error('This script needs a error log group write error logs to Cloudwatch.');
    }else if(!process.env.TIMESTREAM_DB_NAME) {
        throw Error('This script needs a Timestream database name.');
    }else if(!process.env.TIMESTREAM_TABLE_NAME) {
        throw Error('This script needs a Timestream table name.');
    }
}

const runUpdate = async () => {

    validateVars();
    await insertTimeStreamRule('test-rule');
}

const options = new Options(
    process.env.AWS_ACCESS_KEY_ID,
    process.env.AWS_SECRET_ACCESS_KEY,
    process.env.AWS_SESSION_TOKEN
);

const aws = new Aws(options);


console.log('Update IOT Rules');
runUpdate().then(value =>console.log('Finished importing IOT rules.')).catch(reason => console.error(`Problem importing IOT rules ${JSON.stringify(reason)}`));


async function insertTimeStreamRule(ruleName: string): Promise<any> {
    let dataReturn;
    const payload = `{ \
        \\\"sql\\\": \\\"SELECT value FROM '\\\$aws/sitewise/#'\\\", \
        \\\"awsIotSqlVersion\\\": \\\"2016-03-23\\\", \
        \\\"description\\\":\\\"${ruleName}\\\",\
        \\\"actions\\\":[\
            {\
                \\\"timestream\\\":{\
                    \\\"roleArn\\\":\\\"${process.env.TIMESTREAM_INSERT_ROLE}\\\",\
                    \\\"databaseName\\\":\\\"${process.env.TIMESTREAM_DB_NAME}\\\",\
                    \\\"tableName\\\":\\\"${process.env.TIMESTREAM_TABLE_NAME}\\\",\
                    \\\"dimensions\\\":[ \
                        {\\\"name\\\":\\\"property\\\",\\\"value\\\":\\\"dimensional-value\\\"}, \
                    ]\
                }\
            }\
        ], \
         \\\"errorAction\\\":{\
             \\\"cloudwatchLogs\\\":{ \
                  \\\"logGroupName\\\":\\\"${process.env.TIMESTREAM_ERROR_LOG_GROUP}\\\", \
                  \\\"roleArn\\\":\\\"${process.env.TIMESTREAM_ERROR_LOG_ROLE}\\\" \
              }\ 
           }\
    }`;

    await aws.command("iot create-topic-rule --rule-name " + ruleName + " --topic-rule-payload \"" + payload + "\"").then(function (data: any) {
        console.log(`Successful added rule for asset ${ruleName}`);
        dataReturn = data;
    }).catch(function (error: any) {
        console.error(error);
        throw Error(error);
    });
    return dataReturn;
}