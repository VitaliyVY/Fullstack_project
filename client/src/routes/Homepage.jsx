import { Link } from "react-router-dom";
import MainCategories from "../components/MainCategories";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";

const Homepage = () => {
  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* BREADCRUMB */}
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <span>•</span>
        <span className="text-blue-800">Blogs and Articles</span>
      </div>
      {/* INTRODUCTION */}
      <div className="flex items-center justify-between">
        {/* titles */}
        <div className="">
          <h1 className="text-gray-800 text-xl md:text-3xl lg:text-4xl font-bold">
            DevOps Deployment Guide: JavaScript, Backend, CI/CD та AI
          </h1>
          <p className="mt-8 text-md md:text-xl">
            Looking for a practical devops deployment guide? Welcome to Lama
            Dev’s tech blog, where we share real-world insights on JavaScript,
            frontend and backend development, DevOps practices, and AI. As
            developers ourselves, we focus on clear, step-by-step explanations
            to help you deploy applications, manage environments, and build
            scalable systems without unnecessary complexity.
          </p>
        </div>
        {/* animated button */}
        <Link to="write" className="hidden md:block relative">
          <svg
            viewBox="0 0 200 200"
            width="200"
            height="200"
            // className="text-lg tracking-widest animate-spin animatedButton"
            className="text-lg tracking-widest"
          >
            <path
              id="circlePath"
              fill="none"
              d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
            />
            <text>
              <textPath href="#circlePath" startOffset="0%">
                Write your story •
              </textPath>
              <textPath href="#circlePath" startOffset="50%">
                Share your idea •
              </textPath>
            </text>
          </svg>
          <button className="absolute top-0 left-0 right-0 bottom-0 m-auto w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="50"
              height="50"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <line x1="6" y1="18" x2="18" y2="6" />
              <polyline points="9 6 18 6 18 15" />
            </svg>
          </button>
        </Link>
      </div>
      {/* SEO CONTENT */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Mastering JavaScript: From Basics to Advanced Concepts
        </h2>
        <p className="text-lg leading-relaxed mb-6">
          JavaScript remains the backbone of web development, powering
          interactive websites and applications worldwide. In our tech blog, we
          break down complex JavaScript concepts into digestible tutorials that
          help both newcomers and seasoned developers alike. Learn about ES6
          features, asynchronous programming with promises and async/await, and
          how to build robust applications using frameworks like React and
          Node.js. Our articles include practical examples, code snippets, and
          real-world scenarios to ensure you can apply what you learn
          immediately.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          According to the 2023 Stack Overflow Developer Survey, JavaScript has
          been the most commonly used programming language for eight consecutive
          years, with 65.36% of developers using it regularly. This statistic
          underscores the importance of mastering JavaScript fundamentals,
          whether you&apos;re working on frontend interfaces or server-side logic.
          Our guides cover everything from DOM manipulation and event handling
          to advanced topics like closures, prototypes, and performance
          optimization techniques.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Frontend Development: Creating Engaging User Experiences
        </h2>
        <p className="text-lg leading-relaxed mb-6">
          Frontend development focuses on the user-facing part of web
          applications, combining HTML, CSS, and JavaScript to create intuitive
          and visually appealing interfaces. Our tech blog explores the latest
          frontend technologies, including responsive design principles, CSS
          frameworks like Tailwind CSS, and component-based architectures. We
          discuss how to implement accessibility features, optimize loading
          times, and create mobile-first designs that work seamlessly across all
          devices.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          Drawing from our experience building full-stack applications, we
          emphasize the importance of user experience (UX) in frontend
          development. Techniques like lazy loading, code splitting, and
          progressive web app (PWA) implementation can significantly improve
          performance and user engagement. Our tutorials walk you through
          creating interactive forms, implementing smooth animations, and
          integrating third-party APIs to enhance your web applications.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Backend Technologies: Building Scalable Server-Side Solutions
        </h2>
        <p className="text-lg leading-relaxed mb-6">
          The backend is the engine that powers your applications, handling data
          processing, business logic, and server communications. In our tech
          blog, we delve into backend development using technologies like
          Node.js, Express.js, and various database systems including MongoDB
          and PostgreSQL. Learn how to design RESTful APIs, implement
          authentication and authorization, and ensure data security in your
          applications.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          Based on industry reports from sources like the Node.js Foundation,
          Node.js continues to gain popularity for backend development due to
          its event-driven architecture and ability to handle concurrent
          connections efficiently. Our articles provide practical insights on
          database design, caching strategies, and microservices architecture,
          helping you build robust and scalable backend systems that can grow
          with your application&apos;s needs.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          DevOps Deployment Guide: Best Practices for CI/CD and Automation
        </h2>
        <p className="text-lg leading-relaxed mb-6">
          DevOps bridges the gap between development and operations, enabling
          faster and more reliable software delivery. Our tech blog covers
          essential DevOps tools and practices, including containerization with
          Docker, orchestration with Kubernetes, and continuous
          integration/continuous deployment (CI/CD) pipelines. We explain how to
          automate testing, monitoring, and deployment processes to improve code
          quality and reduce time-to-market.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          From our hands-on experience managing deployment pipelines, we know
          that implementing DevOps practices can reduce deployment failures by
          up to 50% and increase deployment frequency significantly. Our guides
          include step-by-step tutorials on setting up CI/CD workflows,
          configuring monitoring tools like Prometheus and Grafana, and
          implementing infrastructure as code using tools like Terraform.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Artificial Intelligence and Machine Learning in Modern Tech
        </h2>
        <p className="text-lg leading-relaxed mb-6">
          AI and machine learning are transforming industries, and understanding
          these technologies is crucial for modern developers. Our tech blog
          explores how to integrate AI capabilities into web applications, from
          simple chatbots to complex recommendation systems. We cover popular
          libraries like TensorFlow.js for browser-based ML and discuss ethical
          considerations in AI development.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          According to McKinsey&apos;s Global AI Survey 2023, 55% of companies have
          adopted AI in at least one function, highlighting the growing
          importance of AI skills in the tech industry. Our articles provide
          accessible introductions to machine learning concepts, practical
          implementations, and case studies showing how AI can enhance user
          experiences and business outcomes.
        </p>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Conclusion: Start Your Tech Learning Journey Today
          </h2>
          <p className="text-lg leading-relaxed mb-6">
            Whether you&apos;re passionate about JavaScript programming, frontend
            design, backend architecture, DevOps automation, or AI innovation,
            our tech blog offers comprehensive resources to support your growth
            as a developer. We believe in practical, hands-on learning that
            combines theoretical knowledge with real-world application. By
            staying updated with the latest trends and best practices in web
            development, software engineering, and emerging technologies, you&apos;ll
            be well-equipped to tackle complex projects and advance your career.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            Join thousands of developers who rely on our tutorials, insights,
            and expert guidance to stay ahead in the rapidly evolving tech
            landscape. Our community-driven approach ensures that our content
            remains relevant, accurate, and valuable. Start exploring our
            articles today and take the first step towards mastering the
            technologies that power the digital world.
          </p>
          <div className="text-center">
            <Link
              to="/posts"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Explore Our Latest Articles
            </Link>
          </div>
        </div>
      </div>
      {/* CATEGORIES */}
      <div className="defer-render">
        <MainCategories />
      </div>
      {/* FEATURED POSTS */}
      <div className="defer-render">
        <FeaturedPosts />
      </div>
      {/* POST LIST */}
      <div className="defer-render">
        <h2 className="my-8 text-2xl text-gray-600">Recent Posts</h2>
        <PostList />
      </div>
    </div>
  );
};

export default Homepage;
