export default function handler(req, res) {
    // console.log("Hello route accessed");
    res.status(200).json({ message: "Hello, world!" });
}
