const prisma = require('./config/db')

const assignEmployeeCodes = async () => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' }
  })

  for (let i = 0; i < users.length; i++) {
    const code = 'EMP-' + String(i + 1).padStart(4, '0')
    await prisma.user.update({
      where: { id: users[i].id },
      data: { employeeCode: code }
    })
    console.log(users[i].name + ' -> ' + code)
  }

  console.log('Done assigning employee codes')
  process.exit(0)
}

assignEmployeeCodes()
