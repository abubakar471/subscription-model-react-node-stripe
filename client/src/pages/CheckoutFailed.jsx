const CheckoutFailed = () => {
  return (
    <div className="home">
      <h1 style={{ color: "red" }}>Failed. Please try again</h1>;
      <div style={{ display: "flex", alignItems: "center", gap: "0 5px" }}>
        <a href="/" style={{ background: "green" }}>
          Go To Home Page
        </a>
        <a href="/protected">Protected Page</a>
      </div>
    </div>
  );
};

export default CheckoutFailed;
