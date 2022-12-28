import dotenv from 'dotenv'

dotenv.config()
const {
    db,
    PORT,
    PAPER,
    SALT,
    TOKEN
} = process.env

export default{
    port:PORT,
    db:db,
    paper:PAPER,
    salt:SALT,
    token:TOKEN
}