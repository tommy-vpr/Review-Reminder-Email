import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Hr,
} from "@react-email/components";

export default function PasswordChangeEmail() {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Text style={logo}>twitch</Text>

          <Text style={paragraph}>
            You updated the password for your Twitch account on Jun 23, 2022,
            4:06:00 PM. If this was you, then no further action is required.
          </Text>

          <Text style={paragraph}>
            However, if you did <strong>NOT</strong> perform this password
            change, please{" "}
            <Link href="https://www.twitch.tv/account/reset-password">
              reset your account password
            </Link>{" "}
            immediately.
          </Text>

          <Text style={paragraph}>
            Remember to use a password that is both strong and unique to your
            Twitch account. To learn more about creating a strong password,{" "}
            <Link href="https://help.twitch.tv">click here</Link>.
          </Text>

          <Text style={paragraph}>
            Still have questions? Please contact{" "}
            <Link href="https://help.twitch.tv">Twitch Support</Link>.
          </Text>

          <Text style={paragraph}>
            Thanks,
            <br />
            Twitch Support Team
          </Text>

          <Hr />
          <Text style={footer}>
            © 2022 Twitch, All Rights Reserved
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

const logo = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#9146FF",
  marginBottom: "20px",
  textTransform: "uppercase",
} as const;

const paragraph = {
  fontSize: "14px",
  color: "#333333",
  lineHeight: "1.5",
  marginBottom: "16px",
};

const footer = {
  fontSize: "12px",
  color: "#999999",
  textAlign: "center" as const,
  marginTop: "20px",
};
