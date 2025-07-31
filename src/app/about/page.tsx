import Image from "next/image";
import Link from "next/link";

const AboutPage = () => {
  return (
    <div className="p-6">
      <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">Who am I?</h1>
        <Image
          src="/images/profile.jpg"
          alt="Maximilian Posnik"
          width={250}
          height={250}
          className="mb-6 rounded-full border-4 border-gray-700"
        />
        <p className="max-w-2xl mb-8 text-lg text-gray-300 leading-relaxed">
          Hi, that's me! <br /> My name is Maximilian Posnik,
          <br />I am a Fullstack Developer/Web3 Security Researcher from
          Springfield, Massachusetts. My mission is to advance blockchain
          integration by raising the standard for what is considered to be
          secure code.
        </p>
        <h2 className="text-3xl font-bold mb-6 text-blue-400">
          How can you reach me?
        </h2>
        <Link
          href="https://www.linkedin.com/in/maxposnik/"
          className="text-blue-400 hover:text-blue-300 underline text-3xl mb-4 transition-colors"
        >
          LinkedIn
        </Link>
        <p className="text-xl text-gray-400">
          mposnikmle@gmail.com
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
