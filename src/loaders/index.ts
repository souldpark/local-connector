// import monitorLoader from "./monitor.loader";
import expressLoader from "./express.loader";

export default async () => {
  expressLoader(process.env.NODE_PORT);
};
