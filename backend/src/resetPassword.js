const bcrypt = require('bcryptjs')
const prisma = require('./config/db')

const resetPassword = async () => {
  const hashed = await bcrypt.hash('test123', 12)
  const user = await prisma.user.update({
    where: { email: 'never75mind@gmail.com' },
    data: { password: hashed }
  })
  console.log('Password reset for:', user.name)
  process.exit(0)
}

resetPassword()
