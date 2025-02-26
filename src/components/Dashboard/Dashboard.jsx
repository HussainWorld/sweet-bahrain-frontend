import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { index } from "../../services/productService";
import { ProductContext } from "../../contexts/ProductContext";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import { UserContext } from "../../contexts/UserContext";

const Dashboard = () => {
  const { products, setProducts } = useContext(ProductContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  let isAdmin = user?.userType === "admin";

  useEffect(() => {
    const fetchingProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts = await index();

        // Only update state if new products are detected
        if (fetchedProducts.length !== products.length) {
          setProducts(fetchedProducts);
          localStorage.setItem("products", JSON.stringify(fetchedProducts));
        }
      } catch (err) {
        setError("Failed to load products. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchingProducts();
  }, [products.length, setProducts]); // ✅ Runs only when `products.length` changes

  return (
    <main style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center", padding: "20px" }}>
      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : products.length === 0 ? (
        <p>No products available</p>
      ) : (
        products.map((prdObj) => (
          <div key={prdObj._id} onClick={() => navigate(isAdmin ? `/edit-product/${prdObj._id}` : `/checkout/${prdObj._id}`)} style={{ cursor: "pointer" }}>
            <Card style={{ width: "16rem", height: "16rem", display: "flex", flexDirection: "column" }}>
              <Card.Img variant="top" src={prdObj.image} style={{ width: "100%", height: "60%", objectFit: "cover" }} />
              <Card.Body style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "12px" }}>
                <Card.Title style={{ width: "100%", fontSize: "16px", fontWeight: "bold", whiteSpace: "normal" }}>
                  {prdObj.name}
                </Card.Title>
                <Card.Title style={{ width: "100%", fontSize: "16px", fontWeight: "bold", whiteSpace: "normal" }}>
                  BHD {prdObj.price}
                </Card.Title>
                <Card.Text style={{ width: "100%", fontSize: "14px", whiteSpace: "normal", overflowWrap: "break-word" }}>
                  {prdObj.description || "No description available."}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))
      )}
    </main>
  );
};

export default Dashboard;
