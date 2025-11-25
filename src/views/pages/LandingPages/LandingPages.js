    import React, { useState, useEffect } from 'react'
    import 'bootstrap/dist/css/bootstrap.min.css'
    import {
    CNav,
    CNavItem,
    CNavLink,
    CAccordion,
    CAccordionItem,
    CAccordionHeader,
    CAccordionBody,
    CFooter,
    CLink,
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CForm,
    CFormInput,
    CFormLabel,
    CFormTextarea,
    CButton,
    } from '@coreui/react'

    export default function LandingPages() {
    const [navbarSolid, setNavbarSolid] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [formSent, setFormSent] = useState(false)

    useEffect(() => {
        const handleScroll = () => setNavbarSolid(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!name.trim() || !email.trim() || !message.trim()) return
        setFormSent(true)
        setTimeout(() => setFormSent(false), 3000)
        setName('')
        setEmail('')
        setMessage('')
    }

    return (
        <div className="min-vh-100" style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f3f7f3' }}>

        <header
            className={`shadow-sm fixed-top transition-all ${navbarSolid ? 'bg-white' : ''}`}
            style={{ backgroundColor: navbarSolid ? '#ffffff' : 'rgba(232,245,233,0.8)', backdropFilter: 'blur(6px)' }}
        >
            <div className="container py-2">
            <CNav variant="tabs" className="justify-content-center fs-5 fw-semibold" style={{ '--cui-nav-link-color': '#2e7d32' }}>
                <CNavItem><CNavLink href="#" active style={{ color: '#1b5e20' }}>Minec</CNavLink></CNavItem>
                <CNavItem><CNavLink href="#mision" style={{ color: '#2e7d32' }}>Misión y Visión</CNavLink></CNavItem>
                <CNavItem><CNavLink href="#juridico" style={{ color: '#2e7d32' }}>Marco Jurídico</CNavLink></CNavItem>
                <CNavItem><CNavLink href="#contact" style={{ color: '#2e7d32' }}>Contacto</CNavLink></CNavItem>
            </CNav>
            </div>
        </header>

        <section className="position-relative" style={{ marginTop: '75px' }}>
            <div className="position-relative">
            <img
                src="https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80"
                className="d-block w-100"
                alt="Paisaje ecosocial"
                style={{ maxHeight: '650px', objectFit: 'cover', filter: 'brightness(0.75)' }}
            />

            <div className="position-absolute top-50 start-50 translate-middle text-center text-light p-4 rounded-4"
                style={{ background: 'rgba(27, 94, 32, 0.55)', backdropFilter: 'blur(6px)' }}>
                <h1 className="fw-bold display-4">Ministerio del Ecosocialismo</h1>
                <p className="fs-4">Comprometidos con un futuro sustentable</p>
            </div>
            </div>
        </section>

        <section className="py-5">
            <CContainer>
            <CRow className="justify-content-center text-center">
                <CCol md={10}>
                <h2 className="fw-bold fs-1 mb-4" style={{ color: '#1b5e20' }}>¿Qué es MiSistema?</h2>
                <p className="text-muted fs-5">
                    Una plataforma moderna, intuitiva y eficiente diseñada para potenciar la administración,
                    la gestión documental y el talento humano bajo estándares ecosocialistas.
                </p>
                </CCol>
            </CRow>
            </CContainer>
        </section>

        <section id="mision" className="py-5" style={{ backgroundColor: '#e8f5e9' }}>
            <CContainer>
            <h2 className="fw-bold text-center fs-1 mb-5" style={{ color: '#1b5e20' }}>Misión & Visión</h2>
            <CRow className="g-4">
                <CCol md={6}>
                <CCard className="shadow-sm border-0" style={{ borderLeft: '6px solid #66bb6a', borderRadius: '18px' }}>
                    <CCardBody>
                    <h3 className="fw-bold" style={{ color: '#2e7d32' }}>Misión</h3>
                    <p className="text-muted fs-5 mt-3">
                        Proteger el ambiente mediante políticas ecosocialistas que impulsen el desarrollo equilibrado
                        y la armonía con la naturaleza.
                    </p>
                    </CCardBody>
                </CCard>
                </CCol>

                <CCol md={6}>
                <CCard className="shadow-sm border-0" style={{ borderLeft: '6px solid #81c784', borderRadius: '18px' }}>
                    <CCardBody>
                    <h3 className="fw-bold" style={{ color: '#2e7d32' }}>Visión</h3>
                    <p className="text-muted fs-5 mt-3">
                        Ser guía nacional e internacional en políticas de conservación ambiental basadas en la inclusión,
                        la educación y la participación social.
                    </p>
                    </CCardBody>
                </CCard>
                </CCol>
            </CRow>
            </CContainer>
        </section>

        <section id="juridico" className="py-5" style={{ backgroundColor: '#f1f8f1' }}>
            <CContainer>
            <h2 className="fw-bold text-center fs-1 mb-4" style={{ color: '#1b5e20' }}>Marco Jurídico</h2>

            <CAccordion alwaysOpen>
                <CAccordionItem itemKey={1}>
                <CAccordionHeader style={{ color: '#2e7d32' }}>Ley del Ambiente</CAccordionHeader>
                <CAccordionBody>
                    Norma que regula la protección, conservación y mejoramiento del ambiente y los recursos naturales.
                </CAccordionBody>
                </CAccordionItem>

                <CAccordionItem itemKey={2}>
                <CAccordionHeader style={{ color: '#2e7d32' }}>Ley de Gestión Ecosocialista</CAccordionHeader>
                <CAccordionBody>
                    Fomenta el uso racional de los recursos naturales bajo un modelo ecosocial de desarrollo.
                </CAccordionBody>
                </CAccordionItem>

                <CAccordionItem itemKey={3}>
                <CAccordionHeader style={{ color: '#2e7d32' }}>Ley de Diversidad Biológica</CAccordionHeader>
                <CAccordionBody>
                    Protege la biodiversidad, los ecosistemas y las especies del territorio nacional.
                </CAccordionBody>
                </CAccordionItem>
            </CAccordion>
            </CContainer>
        </section>

        <section id="contact" className="py-5 text-light" style={{ backgroundColor: '#1b5e20' }}>
            <CContainer>
            <h2 className="text-center fw-bold fs-1 mb-4">Contacto</h2>
            <p className="text-center mb-5 fs-5">¿Tienes dudas? ¡Escríbenos!</p>

            <CForm className="mx-auto" style={{ maxWidth: 600 }} onSubmit={handleSubmit}>
                <CFormLabel className="fw-semibold">Nombre completo</CFormLabel>
                    <CFormInput
                    className="mb-3 py-2"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />

                    <CFormLabel className="fw-semibold">Correo electrónico</CFormLabel>
                    <CFormInput
                    type="email"
                    className="mb-3 py-2"
                    placeholder="Tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />

                    <CFormLabel className="fw-semibold">Mensaje</CFormLabel>
                    <CFormTextarea
                    className="mb-3 py-2"
                    rows={4}
                    placeholder="Escribe tu mensaje"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    />

                    {formSent && (
                    <div className="alert alert-success text-center py-2">
                        ¡Mensaje enviado exitosamente!
                    </div>
                    )}

                    <div className="text-center">
                    <CButton
                        type="submit"
                        className="px-5 py-2 fw-semibold"
                        style={{ backgroundColor: '#66bb6a', border: 'none' }}
                    >
                        Enviar
                    </CButton>
                    </div>
                </CForm>
                </CContainer>
            </section>

            <CFooter className="text-center py-3" style={{ backgroundColor: '#e8f5e9' }}>
                <CLink href="#" style={{ color: '#1b5e20' }}>
                © {new Date().getFullYear()} Ministerio del Ecosocialismo — Todos los derechos reservados.
                </CLink>
            </CFooter>
            </div>
        )
        }
