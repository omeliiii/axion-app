export const GET = () => {
  return new Response(
    JSON.stringify({ message: "Axion App is up and running!" }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
