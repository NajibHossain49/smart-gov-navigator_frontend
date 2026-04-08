export default function HowItWorksSection() {
    const steps = [
        {
            icon: '🔍',
            step: '01',
            title: 'Search or Browse',
            desc: 'Search for a service or browse by category to find what you need.',
        },
        {
            icon: '📋',
            step: '02',
            title: 'View Details',
            desc: 'See step-by-step guides, required documents, and fees.',
        },
        {
            icon: '🏢',
            step: '03',
            title: 'Visit the Office',
            desc: 'Find the nearest office and complete your application.',
        },
    ]

    return (
        <section className="page-container">
            <div className="text-center mb-10">
                <h2 className="section-title">How It Works</h2>
                <p className="text-sm text-slate-500 mt-1">Simple steps to find the service you need</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {steps.map((item) => (
                    <div key={item.step} className="text-center p-5">
                        <div className="text-4xl mb-3">{item.icon}</div>
                        <div className="text-xs font-bold text-primary-400 mb-1 tracking-widest">{item.step}</div>
                        <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}