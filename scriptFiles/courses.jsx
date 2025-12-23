// not sure will this be important but this is for code mirror but if it work then dont
// npm install @uiw/react-codemirror @codemirror/lang-javascript
// import { java } from "@codemirror/lang-java";


let params = new URLSearchParams(window.location.search);
let courseName = params.get("courseName");
let accountUsername = params.get("user");
let courseId = params.get("courseId");


const titleObj = document.getElementById("title");
titleObj.textContent = courseName + " Course"




function renderContentBlock(block, index) {
  switch (block.type) {
    case "image":
      return (
        <div
          key={index}
          id={block.value.id}
          style={{
            margin: "10px 0",
            ...(block.value.style || {})
          }}
        >
          <img
            src={block.value.src}
            alt={block.value.textLabel}
            style={{
              maxWidth: "100%",
              borderRadius: "10px"
            }}
          />
          {block.value.textLabel && (
            <p style={{ textAlign: "center", fontStyle: "italic" , fontSize: "16px"}}>
              {block.value.textLabel}
            </p>
          )}
        </div>
      );


    case "text":
      return (
        <p key={index} id={block.value.id} style={{fontSize: "16px"}}>
          {block.value.textLabel}
        </p>
      );

    case "code":
      return (
        <pre
          key={index}
          id={block.value.id}
          style={{
            background: "#1e1e1e",
            color: "#dcdcdc",
            padding: "10px",
            borderRadius: "8px",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          <code style={{fontSize: "18px"}}>{block.value.code}</code>
        </pre>
      );

    case "contentBox":
      return (
        <div key={index} style={block.value.style} id={block.value.id}>
          {block.value.nestedContent?.map((nested, i) =>
            renderContentBlock(nested, i)
          )}
        </div>
      );

    case "codeBlock":
      return (
        <div key={index} id={block.value.id}>
          <Container
            style={{
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "20px",
              background: "#fafafa",
              fontSize: "16px"
            }}
          >
            <h2>Example:</h2>
            <pre
              style={{
                width: "100%",
                background: "#1e1e1e",
                color: "#eee",
                padding: "12px",
                borderRadius: "8px",
                overflowX: "auto",
                whiteSpace: "pre-wrap",
                marginBottom: "12px",
              }}
            >
              <code>{block.value.code}</code>
            </pre>

            <h3>Output:</h3>
            <pre
              style={{
                width: "100%",
                background: "#2b2b2b",
                color: "#e6e6e6",
                padding: "12px",
                borderRadius: "8px",
                overflowX: "auto",
                whiteSpace: "pre-wrap",
              }}
            >
              <code>{block.value.output}</code>
            </pre>
          </Container>
        </div>
      );

    default:
      return (
        <p key={index} style={{ color: "red" }} id={block.value.id}>
          ⚠ Unknown content type: {block.type}
        </p>
      );
  }
}




function SplitScreen() {
  const [isNavVisible, setIsNavVisible] = React.useState(true);
  const [showContent, setShowContent] = React.useState(true); // variable that tell wether to show navigation bar or not
  const [activeContent, setActiveContent] = React.useState(null); // current selected content
  const [openDropdown, setOpenDropdown] = React.useState(null);
  
  /////////////////////////////////////////
  //     This is where we store data     //
  /////////////////////////////////////////

  const [data, setData] = React.useState({});
  const [error, setError] = React.useState(false);
  React.useEffect(() => {
    const filePath = "/data/course/" + courseName + ".json"
    fetch(filePath)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Data not found");
      }
      return res.json();
    })
    .then((json) => setData(json))
    .catch((err) => {
      console.error("Error loading data:", err);
      setError(true);
    });
  }, []);

  if (error) {
    return <p style={{ textAlign: "center", color: "red" }}>Page not found</p>;
  }

  if (data === null) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  const toggleNav = () => {
    if (isNavVisible) {
      // Hide Content and Bar
      setShowContent(false);
      setTimeout(() => setIsNavVisible(false), 50);
    } else {
      // Show Navigation Bar
      setIsNavVisible(true);
      setTimeout(() => setShowContent(true), 50);
    }
  };

  const containerStyle = {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
    transition: "all 0.3s ease",
  };

  const leftStyle = {
    width: isNavVisible ? "15%" : "0%",
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
    padding: isNavVisible ? "10px" : "0",
    borderRight: isNavVisible ? "1px solid #ccc" : "none",
    transition: "width 0.3s ease, padding 0.3s ease",
    position: "relative",
    overflowY: "auto",
    maxHeight: "100vh",
    scrollbarWidth: "thin",
  };

  const rightStyle = {
    margin: "3% auto",
    width: isNavVisible ? "85%" : "100%",
    backgroundColor: "#fff",
    overflowY: "auto",
    padding: "10px",
    transition: "all 0.3s ease, padding 0.3s ease",
  };

  const buttonStyle = {
    position: "fixed",
    top: "1.5%",
    left: isNavVisible ? "17%" : "1%",
    zIndex: 1000,
    padding: "10px 14px",
    cursor: "pointer",
    borderRadius: "5px",
    backgroundColor: isNavVisible ? "#ccc" : "#f0f0f0",
    transition: "left 0.3s ease, background-color 0.3s ease",
  };

  const homeButtonStyle = {
    position: "fixed",
    top: "92%",
    left: isNavVisible ? "1%" : "1%",
    zIndex: 1000,
    width: "14%",
    padding: "10px 14px",
    cursor: "pointer",
    borderRadius: "5px",
    backgroundColor: isNavVisible ? "#ccc" : "#f0f0f0",
    transition: "left 0.3s ease, background-color 0.3s ease",
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    fontSize: "20px",
    fontWeight: "700"
  };
  
  const playGroundButtonStyle = {
    position: "fixed",
    top: "85%",
    left: isNavVisible ? "1%" : "1%",
    zIndex: 1000,
    width: "14%",
    padding: "10px 14px",
    cursor: "pointer",
    borderRadius: "5px",
    backgroundColor: isNavVisible ? "#ccc" : "#f0f0f0",
    transition: "left 0.3s ease, background-color 0.3s ease",
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    fontSize: "20px",
    fontWeight: "700"
  };

  const textContainerStyle = {
    opacity: showContent ? 1 : 0,
    transition: "opacity 0.3s ease",
  };

  const buttonLink = {
    display: "inline-block",
    width: "65%",
    margin: "1% 5%",
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  };


  const buttonLinkQuiz = {
    display: "inline-block",
    width: "65%",
    margin: "1% 5%",
    padding: "10px 20px",
    backgroundColor: "#ba2222ff",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  };

  return (
    <>
      <button style={buttonStyle} onClick={toggleNav}>
        {isNavVisible ? "<" : ">"}
      </button>

      
      <div style={containerStyle}>
        {/* Left Side Navigation */}
        <div style={{ ...leftStyle, ...textContainerStyle}}>

          <Container>
            <h2>Navigation</h2>
            {Object.keys(data).map((key) => {



              const line = data[key];
              const main = line["Main Line"];

              return (
                <DropDownNavigation
                  key={key}
                  label={main.label}
                  color={openDropdown === key ? "#ccc" : "#ffffff"}
                  isOpen={openDropdown === key}
                  onClickHeader={() => {
                    if (openDropdown === key) {
                      // Clicking the open dropdown closes it
                      setOpenDropdown(null);
                      setActiveContent(null);
                    } else {
                      // Open this dropdown, close others
                      setOpenDropdown(key);
                      setActiveContent(key);
                    }
                  }}
                >
                  {main.links?.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      style={buttonLink}
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default jump
                        const targetId = link.href.replace('#', '');
                        const targetElement = document.getElementById(targetId);
                        if (targetElement) {
                          targetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      {link.text}
                    </a>
                  ))}

                  {main.examId?.map((examId, i) => (
                    <a
                      key={i}
                      style={buttonLinkQuiz}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = "exam.html?user=" + encodeURIComponent(accountUsername) + "&languageId=" + encodeURIComponent(courseId) + "&id=" + encodeURIComponent(examId);
                      }}
                    >
                      Quiz-{i + 1}
                    </a>
                  ))}
                </DropDownNavigation>
              );
            })}

            <div style={{ height: "150px" }} />


            <button style={homeButtonStyle} onClick={() => {
              window.location.href = "home.html?user=" + encodeURIComponent(accountUsername);
            }}>
              Home
            </button>
            <button style={playGroundButtonStyle} onClick={() => {
              window.location.href = "playGround.html?user=" + encodeURIComponent(accountUsername) + "&languageId=" + encodeURIComponent(courseId);
            }}>
              Play Ground
            </button>
          </Container>
        </div>

        {/* Right Side Content */}
        <div style={rightStyle}>
          <Container>
            {activeContent ? (
              (() => {
                const line = data[activeContent];


                if (!line || !line["Content"]) {
                  return (
                    <div>
                      <h1>Error</h1>
                      <p>Page not found.</p>
                    </div>
                  );
                }

                const content = line["Content"];

                return (
                  <div>
                    <h1>{content.contentTitle}</h1>
                    {content.contentBody?.map(renderContentBlock)}
                  </div>
                );
              })()
            ) : (
              <>
                <h1>{courseName}</h1>
                <p>Select a section on the left to load its content.</p>
              </>
            )}
          </Container>
        </div>
      </div>
    </>
  );
}

function Container({ children , style}) {
  return <div style={style}>{children}</div>;
}

function DropDownNavigation({ label, children, color, isOpen, onClickHeader }) {

  const dropDownStyle = {
    border: `1px solid ${color}`,
    borderRadius: "6px",
    margin: "8px 0",
    backgroundColor: isOpen ? "#ccc" : "#fff",
    overflow: "hidden",
    transition: "all 0.3s ease",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    padding: "10px 15px",
    backgroundColor: color,
    color: "#000",
    fontWeight: "bold",
    userSelect: "none",
  };

  const arrowStyle = {
    transition: "transform 0.3s ease",
    transform: isOpen ? "rotate(270deg)" : "rotate(180deg)",
  };

  const contentStyle = {
    maxHeight: isOpen ? "1000px" : "0",
    overflow: "hidden",
    padding: isOpen ? "10px 15px" : "0 15px",
  };

  return (
    <div style={dropDownStyle}>
      <div style={headerStyle} onClick={onClickHeader}>
        <span>{label}</span>
        <span style={arrowStyle}>&lt;</span>
      </div>
      <div style={contentStyle}>
        {children}

        {/* --------- link to the test -------- */}
        
      </div>
    </div>
  );
}

const rootEl = document.getElementById("root");

if (!rootEl._reactRootContainer) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<SplitScreen />);
}
