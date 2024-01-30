import winston, { LogEntry } from "winston";
import { ElasticsearchTransport } from "winston-elasticsearch";
import { Client } from "@elastic/elasticsearch";
import dotenv from 'dotenv';
dotenv.config();
// Database connection configuration
const elasticHost = process.env.EL_HOST || 'raspberrypi.local';

const client = new Client({ node: `http://${elasticHost}:9200` });

interface EsTransportOpts {
  level: string;
  client: Client;
  indexPrefix: string;
  bufferLimit: number;
  transformer: (logData: LogEntry) => any; // Replace 'any' with a more specific type if possible
}

const esTransportOpts: EsTransportOpts = {
  level: "info",
  client: client,
  indexPrefix: "assatec",
  bufferLimit: 2000,
  transformer: (logData: LogEntry) => {
    return {
      "@timestamp": new Date().toISOString(),
      message: logData.message,
      level: logData.level,
      meta: logData.meta, // Ensure that 'meta' exists on LogEntry or define a more specific interface
    };
  },
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new ElasticsearchTransport(esTransportOpts),
  ],
});

export default logger;
