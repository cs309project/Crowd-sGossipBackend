import dotenv from 'dotenv'

dotenv.config()
const {
    db,
    PORT,
    PAPER,
    SALT,
    TOKEN,
    DEFUALTAVATAR,
    IOPORT,
    IOURL,
    URL_ENDPOINT,
    PUBLIC_KEY,
    PRIVATE_KEY
} = process.env

export default{
    port:PORT,
    db:db,
    paper:PAPER,
    salt:SALT,
    token:TOKEN,
    defaultPhoto:DEFUALTAVATAR,
    ioPort:IOPORT,
    ioUrl:IOURL,
    urlEndpoint:URL_ENDPOINT,
    publicKey:PUBLIC_KEY,
    privateKey:PRIVATE_KEY
}