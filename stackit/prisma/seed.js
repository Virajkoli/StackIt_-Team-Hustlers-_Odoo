const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user1 = await prisma.user.upsert({
    where: { email: 'admin@stackit.com' },
    update: {},
    create: {
      email: 'admin@stackit.com',
      name: 'Admin User',
      username: 'admin',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
      username: 'johndoe',
      password: hashedPassword,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      username: 'janesmith',
      password: hashedPassword,
    },
  });

  console.log('✅ Users created');

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'javascript' },
      update: {},
      create: { name: 'javascript', color: '#F7DF1E' },
    }),
    prisma.tag.upsert({
      where: { name: 'react' },
      update: {},
      create: { name: 'react', color: '#61DAFB' },
    }),
    prisma.tag.upsert({
      where: { name: 'nextjs' },
      update: {},
      create: { name: 'nextjs', color: '#000000' },
    }),
    prisma.tag.upsert({
      where: { name: 'css' },
      update: {},
      create: { name: 'css', color: '#1572B6' },
    }),
    prisma.tag.upsert({
      where: { name: 'html' },
      update: {},
      create: { name: 'html', color: '#E34F26' },
    }),
    prisma.tag.upsert({
      where: { name: 'nodejs' },
      update: {},
      create: { name: 'nodejs', color: '#339933' },
    }),
    prisma.tag.upsert({
      where: { name: 'prisma' },
      update: {},
      create: { name: 'prisma', color: '#2D3748' },
    }),
    prisma.tag.upsert({
      where: { name: 'postgresql' },
      update: {},
      create: { name: 'postgresql', color: '#336791' },
    }),
  ]);

  console.log('✅ Tags created');

  // Create questions
  const question1 = await prisma.question.create({
    data: {
      title: 'How to implement user authentication in Next.js?',
      description: `<p>I'm building a web application with <strong>Next.js</strong> and need to implement user authentication. What are the best practices for handling user sessions and protecting routes?</p>
      
      <p>I've heard about NextAuth.js but I'm not sure how to set it up properly. Any recommendations?</p>
      
      <ul>
        <li>Should I use JWT or sessions?</li>
        <li>How do I protect API routes?</li>
        <li>What about client-side route protection?</li>
      </ul>`,
      authorId: user1.id,
      tags: {
        connect: [
          { id: tags.find(tag => tag.name === 'nextjs').id },
          { id: tags.find(tag => tag.name === 'javascript').id },
          { id: tags.find(tag => tag.name === 'react').id },
        ],
      },
    },
  });

  const question2 = await prisma.question.create({
    data: {
      title: 'PostgreSQL vs MySQL: Which is better for a Q&A platform?',
      description: `<p>I'm deciding between <strong>PostgreSQL</strong> and <strong>MySQL</strong> for my Q&A platform similar to Stack Overflow.</p>
      
      <p>The platform will need to handle:</p>
      <ul>
        <li>Complex queries for search functionality</li>
        <li>Full-text search</li>
        <li>Hierarchical data (comments, nested replies)</li>
        <li>High read/write ratios</li>
      </ul>
      
      <p>What are your experiences with these databases for similar use cases?</p>`,
      authorId: user2.id,
      tags: {
        connect: [
          { id: tags.find(tag => tag.name === 'postgresql').id },
          { id: tags.find(tag => tag.name === 'nodejs').id },
        ],
      },
    },
  });

  const question3 = await prisma.question.create({
    data: {
      title: 'Best practices for React component optimization',
      description: `<p>I'm working on a large React application and noticing performance issues. What are the current best practices for optimizing React components?</p>
      
      <h3>Specific areas I'm concerned about:</h3>
      <ul>
        <li><code>useMemo</code> vs <code>useCallback</code> - when to use each?</li>
        <li>Component memoization with <code>React.memo</code></li>
        <li>State management patterns that don't cause unnecessary re-renders</li>
        <li>Bundle splitting strategies</li>
      </ul>
      
      <p>Any tools or techniques you'd recommend for profiling and identifying bottlenecks?</p>`,
      authorId: user3.id,
      tags: {
        connect: [
          { id: tags.find(tag => tag.name === 'react').id },
          { id: tags.find(tag => tag.name === 'javascript').id },
        ],
      },
    },
  });

  console.log('✅ Questions created');

  // Create some answers
  const answer1 = await prisma.answer.create({
    data: {
      content: `<p>Great question! For Next.js authentication, I highly recommend using <strong>NextAuth.js</strong>. Here's a basic setup:</p>
      
      <h3>1. Installation</h3>
      <pre><code>npm install next-auth</code></pre>
      
      <h3>2. Configuration</h3>
      <p>Create <code>pages/api/auth/[...nextauth].js</code>:</p>
      <pre><code>import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    CredentialsProvider({
      // Your credential logic here
    })
  ],
  // Add your configuration
})</code></pre>
      
      <p>For your specific questions:</p>
      <ul>
        <li><strong>JWT vs Sessions:</strong> NextAuth.js handles this for you, but you can configure it</li>
        <li><strong>API Protection:</strong> Use <code>getServerSession</code> in API routes</li>
        <li><strong>Client Protection:</strong> Use <code>useSession</code> hook</li>
      </ul>`,
      authorId: user2.id,
      questionId: question1.id,
      isAccepted: true,
    },
  });

  const answer2 = await prisma.answer.create({
    data: {
      content: `<p>I've used both extensively, and for a Q&A platform, I'd lean towards <strong>PostgreSQL</strong> for several reasons:</p>
      
      <h3>Why PostgreSQL?</h3>
      <ul>
        <li><strong>Full-text search:</strong> Built-in support with GIN indexes</li>
        <li><strong>JSON support:</strong> Great for storing flexible data like vote metadata</li>
        <li><strong>CTEs:</strong> Perfect for hierarchical queries (comment threads)</li>
        <li><strong>Performance:</strong> Generally better for read-heavy workloads</li>
        <li><strong>Standards compliance:</strong> More SQL standard compliant</li>
      </ul>
      
      <h3>Example full-text search query:</h3>
      <pre><code>SELECT * FROM questions 
WHERE to_tsvector('english', title || ' ' || description) 
@@ plainto_tsquery('your search terms');</code></pre>
      
      <p>However, MySQL isn't bad either - it depends on your team's expertise and specific requirements!</p>`,
      authorId: user3.id,
      questionId: question2.id,
      isAccepted: false,
    },
  });

  console.log('✅ Answers created');

  // Create some votes
  await prisma.vote.createMany({
    data: [
      { userId: user2.id, questionId: question1.id, type: 'UP' },
      { userId: user3.id, questionId: question1.id, type: 'UP' },
      { userId: user1.id, questionId: question2.id, type: 'UP' },
      { userId: user3.id, questionId: question2.id, type: 'UP' },
      { userId: user1.id, questionId: question3.id, type: 'UP' },
      { userId: user2.id, questionId: question3.id, type: 'UP' },
      { userId: user1.id, answerId: answer1.id, type: 'UP' },
      { userId: user3.id, answerId: answer1.id, type: 'UP' },
      { userId: user1.id, answerId: answer2.id, type: 'UP' },
      { userId: user2.id, answerId: answer2.id, type: 'UP' },
    ],
  });

  console.log('✅ Votes created');

  // Create some notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user1.id,
        type: 'QUESTION_ANSWERED',
        message: 'Your question "How to implement user authentication in Next.js?" received a new answer',
        read: false,
      },
      {
        userId: user2.id,
        type: 'MENTION',
        message: 'You were mentioned in a discussion',
        read: true,
      },
      {
        userId: user2.id,
        type: 'ANSWER_COMMENTED',
        message: 'Your answer received a new comment',
        read: false,
      },
    ],
  });

  console.log('✅ Notifications created');
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
