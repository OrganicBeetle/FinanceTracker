import "./Hamburger.css"
const Hamburger = ({ isHovered, setIsHovered }) => {
    const Scroll = () => {
        const element = document.getElementById("transaction-history");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      };
    return (
        <div
            className={`hamburger-menu ${isHovered ? "expanded" : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className="hamburger-icon">☰</span>
            {isHovered && <p className="menu-text" onClick={Scroll}>Transaction History</p>}
        </div>
    )
}
export default Hamburger;