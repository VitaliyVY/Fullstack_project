const ABOUT_INFO = {
  name: "LamaLog Tech Blog",
  audience:
    "Блог для junior/middle розробників, студентів IT-спеціальностей та інженерів, які хочуть системно прокачувати практичні навички.",
  mission:
    "Пояснювати складні технічні теми простою мовою, публікувати практичні приклади та підтримувати високий стандарт якості контенту.",
  editorialPolicy: [
    "Публікуємо матеріали тільки після технічної перевірки коду та фактів.",
    "У кожній статті вказуємо автора, дату публікації та дату останнього оновлення.",
    "Оновлюємо застарілі матеріали, якщо змінюються інструменти або підходи.",
  ],
  foundedAt: "15 березня 2026",
  contactEmail: "editor@lamalog.pp.ua",
  socialLinks: [
    { label: "GitHub", href: "https://github.com/lamalog" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/lamalog" },
    { label: "Instagram", href: "https://www.instagram.com/lamalog" },
  ],
};

const AboutPage = () => {
  return (
    <div className="mt-6 max-w-4xl mx-auto flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Про нас</h1>
        <p className="text-lg text-gray-700">
          <span className="font-semibold">{ABOUT_INFO.name}</span> -{" "}
          {ABOUT_INFO.audience}
        </p>
      </header>

      <section className="rounded-2xl border border-gray-200 p-6 bg-white">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Наша місія</h2>
        <p className="text-gray-700 leading-7">{ABOUT_INFO.mission}</p>
      </section>

      <section className="rounded-2xl border border-gray-200 p-6 bg-white">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Редакційна політика
        </h2>
        <ul className="list-disc pl-6 text-gray-700 leading-7">
          {ABOUT_INFO.editorialPolicy.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 p-6 bg-white flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Контакти</h2>
        <p className="text-gray-700">
          Email редакції:{" "}
          <a
            className="text-blue-700 underline"
            href={`mailto:${ABOUT_INFO.contactEmail}`}
          >
            {ABOUT_INFO.contactEmail}
          </a>
        </p>
        <p className="text-gray-700">Дата заснування: {ABOUT_INFO.foundedAt}</p>
        <div className="flex flex-wrap gap-4">
          {ABOUT_INFO.socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full border border-gray-300 text-sm font-medium hover:border-blue-700 hover:text-blue-700 transition-colors"
            >
              {social.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
