// 1
const { PrismaClient } = require("@prisma/client")

// 2
const prisma = new PrismaClient()

// 3
async function main() {
  const user = await prisma.user.findMany({where: {email: 'ibrahimsdakli55@hotmail.com'}})
  const newLink = await prisma.link.create({
    data: {
      postedById: user[0].id,
      description: 'Fullstack tutorial for GraphQL',
      url: 'www.howtographql.com'
    },
  })
  const allLinks = await prisma.link.findMany()
  console.log(allLinks)
}

// 4
main()
  .catch(e => {
    throw e
  })
  // 5
  .finally(async () => {
    await prisma.$disconnect()
  })