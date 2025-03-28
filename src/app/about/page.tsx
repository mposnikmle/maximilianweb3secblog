import Image from "next/image";
import Link from "next/link";

const AboutPage = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center bg-gray-900 p-4 mb-5 text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">Who am I?</h1>
        <Image
          src="/images/profile.jpg"
          alt="Maximilian Posnik"
          width={250}
          height={250}
          className="mb-1 rounded-full border-4 border-gray-700"
        />
        <p className="max-w-2xl mb-4 text-lg text-gray-300">
          Hi, that's me! <br /> My name is Maximilian Posnik,
          <br />I am a Fullstack Developer/Web3 Security Researcher from
          Springfield, Massachusetts. My mission is to advance blockchain
          integration by raising the standard for what is considered to be
          secure code.
        </p>
        <h1 className="text-3xl font-bold mb-4 text-white">
          How can you reach me?
        </h1>
        <Link
          href="https://www.linkedin.com/in/maxposnik/"
          className="text-blue-400 hover:text-blue-300 underline text-3xl mb-2"
        >
          LinkedIn
        </Link>
        <h2 className="text-xl mt-2 mb-2 pb-2 text-gray-400">
          mposnikmle@gmail.com
        </h2>
      </div>
    </>
  );
};

export default AboutPage;
