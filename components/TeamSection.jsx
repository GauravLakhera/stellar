// components/TeamSection.jsx
import Image from 'next/image';

const TeamSection = ({ team }) => {
  return (
    <section className="py-12 font-mono">
      <div className="container mx-auto px-4">
        <h2 className="text-start font-mono text-2xl font-bold mb-2">Meet Our Team</h2>
        {team.map((member, index) => (
          <div
            key={member.name}
            className={`flex flex-col md:flex-row items-center gap-8 mb-16 ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            {/* Image Section */}
            <div className="w-full md:w-1/3 flex-shrink-0">
              <Image
                src={member.image}
                alt={member.name}
                width={500} // Adjust width as needed
                height={500} // Adjust height as needed
                objectFit="cover"
                className="rounded-lg shadow-lg z-[9999] grayscale "
              />
            </div>

            {/* Content Section */}
            <div className="w-full md:w-2/3">
              <h3 className="text-3xl text-gray-800 mb-2">
                {member.name}
              </h3>
              <p className="text-xl font-medium text-gray-600 mb-4">
                {member.position}
              </p>
              <p className="text-gray-700 text-xs leading-relaxed">
                {member.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;