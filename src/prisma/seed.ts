import prisma from '../lib/db/client'

const main = async () => {
  const solutions = [
    {
      id: 'kaps9y6qc0028emc805po1291',
      importDirectives: '',
      testRunner: `
function TestRunner() {
  let input = [[1,1], [2,-2]]

  let expected = [2, 0]

  let actual = []

  for(let i of input) {
    actual.push(sum(i[0], i[1]))
  }

  let status = actual.length === expected.length && actual.every((el, i) => el === expected[i])

  return {
    status,
    actual,
    expected
  }
}
      `,
      sequence: 0,
    },
    {
      id: 'kaps9y6qc0028emc805po1292',
      code: 'function sum(n1, n2) {  return n1 + n2 }',
      importDirectives: '',
      testRunner: `
function TestRunner() {
  let input = [[1,1], [2,-2]]

  let expected = [2, 0]

  let actual = []

  for(let i of input) {
    actual.push(sum(i[0], i[1]))
  }

  let status = actual.length === expected.length && actual.every((el, i) => el === expected[i])

  return {
    status,
    actual,
    expected
  }
}
      `,
      sequence: 0,
    },
  ]

  const testCases = [
    {
      input: '1,1',
      output: '2',
      sequence: 0,
    },
    {
      input: '2,-2',
      output: '0',
      sequence: 1,
    },
  ]

  const actions = [
    {
      id: 'akps9y6qc0028emc805po1291',
      name: 'Check In',
      point: 1,
    },
    {
      id: 'akps9y6qc0028emc805po1292',
      name: 'Completed Quiz',
      point: 2,
    },
  ]

  const quizIds = [
    'ckps9y6qc0028emc805po1294',
    'ckq2bc89y00025kc8diutaxtd',
    'ckpsa1f580031gzc8j2j9eo4o',
    'ckpsercpl0034e6c8cwjhkkds',
  ]

  const quizTitles = [
    'Divide Two Integers',
    'Merge Two Sorted Lists',
    'Find First and Last Position of Element in Sorted Array',
    'Scramble String',
  ]

  const difficultyLevel = [
    {id: 1, name: 'easy'},
    {id: 2, name: 'medium'},
    {id: 3, name: 'hard'},
    {id: 4, name: 'beginner'},
    {id: 5, name: 'intermediate'},
    {id: 6, name: 'advanced'},
  ]

  //insert coding languages
  const codeLang = [
    {id: 1, name: 'javascript', prettyName: 'JavaScript'},
    {id: 2, name: 'python', prettyName: 'Python'},
    {id: 3, name: 'php', prettyName: 'PHP'},
    {id: 4, name: 'csharp', prettyName: 'C#'},
  ]

  console.log('Seeding CodeLanguange...')
  for (let i = 0; i < codeLang.length; i++) {
    const lang = await prisma.codeLanguage.upsert({
      where: {
        name: codeLang[i].name,
      },
      update: {},
      create: {
        id: i + 1,
        name: codeLang[i].name,
        prettyName: codeLang[i].prettyName,
      },
    })
    console.log(`Added CodeLanguage: ${JSON.stringify(lang)}`)
  }
  console.log('Done seeding CodeLanguage...')

  //insert difficulty level
  console.log('Seeding DifficultyLevel...')
  for (let i = 0; i < difficultyLevel.length; i++) {
    const level = await prisma.difficultyLevel.upsert({
      where: {
        name: difficultyLevel[i].name,
      },
      update: {},
      create: {
        id: i + 1,
        name: difficultyLevel[i].name,
      },
    })
    console.log(`Added DifficultyLevel: ${JSON.stringify(level)}`)
  }
  console.log('Done seeding DifficultyLevel...')

  //insert some users
  const users = [
    {
      id: 'ckq2bc89q00005kc89jxy2jvh',
      name: 'John Doe',
      email: 'johndoe@blablabla.com',
    },
    {
      id: 'ckq2bc89q00015kc89bnw6qqv',
      name: '张三',
      email: 'alice@blablabla.com',
    },
  ]

  console.log('Seeding User...')
  for (let i = 0; i < users.length; i++) {
    const user = await prisma.user.upsert({
      where: {
        id: users[i].id,
        //email: users[i].email
      },
      update: {},
      create: {
        id: users[i].id,
        name: users[i].name,
        email: users[i].email,
      },
    })
    console.log(`Added User: ${JSON.stringify(user)}`)

    //insert some quizzes
    console.log('Seeding Quiz...')
    const quizzes = [
      {
        id: quizIds.pop(),
        title: quizTitles.pop(),
        userId: user.id,
        codeLanguageId: codeLang[2].id,
        submissionCachedCount: Math.floor(Math.random() * 100),
        defaultCode: 'async function () {}',
        difficultyLevelId: 1,
        instruction: 'instruction goes here',
        answer: 'answer goes here',
        locale: 'en',
      },
      {
        id: quizIds.pop(),
        title: quizTitles.pop(),
        userId: user.id,
        codeLanguageId: codeLang[3].id,
        submissionCachedCount: Math.floor(Math.random() * 100),
        defaultCode: 'async function () {}',
        difficultyLevelId: 2,
        instruction: 'instruction goes here',
        answer: 'answer goes here',
        locale: 'en',
      },
    ]

    for (let i = 0; i < quizzes.length; i++) {
      const quiz = await prisma.quiz.upsert({
        where: {
          id: quizzes[i].id,
        },
        update: {},
        create: {
          id: quizzes[i].id,
          title: quizzes[i].title || '',
          userId: quizzes[i].userId,
          codeLanguageId: quizzes[i].codeLanguageId,
          submissionCachedCount: quizzes[i].submissionCachedCount,
          defaultCode: quizzes[i].defaultCode,
          difficultyLevelId: quizzes[i].difficultyLevelId,
          locale: quizzes[i].locale,
        },
      })

      console.log(`Adding Solution...`)
      const s = await prisma.solution.upsert({
        where: {
          id: solutions[i].id,
        },
        update: {},
        create: {
          ...solutions[i],
          quizId: quizzes[i].id || '',
        },
      })
      console.log(`Added solution: ${JSON.stringify(s)}`)
      console.log(`Done Adding Solution...`)

      console.log(`Adding Test Case...`)
      for (let j = 0; j < testCases.length; j++) {
        const testCase = await prisma.testCase.upsert({
          where: {
            id: quizzes[i].id,
          },
          update: {},
          create: {
            ...testCases[j],
            solutionId: s.id,
          },
        })
        console.log(`Added test case: ${JSON.stringify(testCase)}`)
      }
      console.log(`Added quiz: ${JSON.stringify(quiz)}`)
    }

    console.log('Done seeding Quiz...')
  }
  console.log('Done seeding User...')

  // insert Assessment Points
  console.log('Seeding Assessment Points...')
  const assessmentPoints = [
    {name: 'easyQuizCompletionPoint', point: 1000},
    {name: 'speedPoint', point: 800},
    {name: 'mediumQuizCompletionPoint', point: 2000},
    {name: 'hardQuizCompletionPoint', point: 3000},
  ]

  for (let i = 0; i < assessmentPoints.length; i++) {
    const assessmentPoint = await prisma.assessmentPoint.upsert({
      where: {
        name: assessmentPoints[i].name,
      },
      update: {},
      create: {
        name: assessmentPoints[i].name,
        point: assessmentPoints[i].point,
      },
    })
    console.log(`Added Assessment Points: ${JSON.stringify(assessmentPoint)}`)
  }
  console.log('Done seeding Assessment Points...')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
