import ContactForm from '../components/ContactForm'

const Contact = () => {
    return (
        <section className="min-h-[50vh] flex items-center justify-center px-8 py-16 page-transition relative">
            <div className="max-w-2xl w-full relative z-10">
                <h1 className="text-5xl md:text-7xl font-light text-text-primary mb-8 tracking-tight">
                    Send a Message
                </h1>
                <div className="h-px w-24 bg-accent mb-12"></div>
                <ContactForm />
            </div>
        </section>
    )
}

export default Contact
