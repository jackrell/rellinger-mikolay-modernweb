const Env = {
  APPLICATION_ID: "LdC2e27NQ7jipj05LNfiDr9RbNoManjsfzwsPIbw", // add from back4app
  JAVASCRIPT_KEY: "ZGZT9lflaPJDtj4NlZkPyu3Vdpu635r69Hrif0Jc",
  SERVER_URL: "https://parseapi.back4app.com"
};

export default Env;

// for backend stuff like python and togetherAI requests
export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5050";