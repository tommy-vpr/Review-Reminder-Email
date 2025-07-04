import {
  Body,
  Container,
  Column,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Hr,
} from "@react-email/components";

type LineItem = {
  title: string;
  productHandle: string;
  image: string | null;
};

type Props = {
  customerName?: string;
  lineItems: LineItem[];
};

export default function ReviewReminderEamil({
  customerName = "there",
  lineItems,
}: Props) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://www.teevong.com/images/Tee-logo.png"
            alt="Teevong Logo"
            width="80"
            style={logoImage}
          />

          <Text style={paragraph}>
            Hey {customerName},
            <br />
            Thanks for your recent order! We’d love to hear your feedback.
            <br />
            Please take a moment to review the products you purchased:
          </Text>

          <Section>
            {lineItems
              .reduce((rows, item, index) => {
                if (index % 2 === 0) rows.push([]);
                rows[rows.length - 1].push(item);
                return rows;
              }, [] as LineItem[][])
              .map((row, rowIndex) => (
                <Row key={rowIndex} style={{ marginBottom: "20px" }}>
                  {row.map((item, colIndex) => (
                    <Column
                      key={colIndex}
                      style={{
                        width: "50%",
                        textAlign: "center",
                        padding: "10px",
                      }}
                    >
                      <Link
                        href={`https://tv-testing-tutorial.myshopify.com/products/${item.productHandle}`}
                        style={{ display: "block", textAlign: "center" }}
                      >
                        <Img
                          src={
                            item.image ||
                            "https://tv-testing-tutorial.myshopify.com/images/placeholder.png"
                          }
                          alt={item.title}
                          width={140}
                          style={productImage}
                        />
                      </Link>
                      <Text style={productTitle}>{item.title}</Text>
                      <Link
                        href={`https://tv-testing-tutorial.myshopify.com/products/${item.productHandle}`}
                        style={productLinkStyle}
                      >
                        View Product
                      </Link>
                    </Column>
                  ))}
                </Row>
              ))}
          </Section>

          <Text style={paragraph}>
            As a thank you, you’ll receive <strong>20% off</strong> your next
            purchase!
          </Text>

          <Hr />
          <Text style={footer}>
            © 2022 TEEVONG, All Rights Reserved
            <br />
            350 Bush Street, 2nd Floor, San Francisco, CA, 94104 - USA
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f4f4f7",
  fontFamily: "Helvetica, Arial, sans-serif",
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  padding: "20px",
  maxWidth: "600px",
  margin: "0 auto",
  borderRadius: "8px",
  boxShadow: "0 0 6px rgba(0,0,0,0.05)",
};

const logoImage = {
  marginBottom: "20px",
};

const paragraph = {
  fontSize: "14px",
  color: "#333333",
  lineHeight: "1.5",
  marginBottom: "16px",
};

const productImage = {
  display: "inline-block",
  margin: "0 auto",
};

const productTitle = {
  fontSize: "16px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  marginBottom: "5px",
  color: "#333",
};

const productLinkStyle = {
  fontSize: "14px",
  color: "cornflowerblue",
  textDecoration: "none",
};

const footer = {
  fontSize: "12px",
  color: "#999999",
  textAlign: "center" as const,
  marginTop: "20px",
};
