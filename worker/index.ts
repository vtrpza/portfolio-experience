const verificationBody = "google-site-verification: google0752999b923df8aa.html\n";

const worker = {
  fetch(): Response {
    return new Response(verificationBody, {
      headers: { "Content-Type": "text/html; charset=UTF-8" },
    });
  },
};

export default worker;
