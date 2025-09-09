import React, { useEffect, useState } from 'react';
import { 
  Heart, 
  Star, 
  Play, 
  CheckCircle, 
  Users, 
  Clock, 
  Award, 
  DollarSign,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Shield,
  BookOpen,
  Video
} from 'lucide-react';

function App() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [isOferta, setIsOferta] = useState(false);

  useEffect(() => {
    if (window.location.hostname.includes("oferta")) {
      setIsOferta(true);
    }
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const [precio, setPrecio] = useState("$49.99 USD");
  const [precioLocal, setPrecioLocal] = useState("");
  const [precioTotal, setPrecioTotal] = useState("");

  useEffect(() => {
    const precioFull = 120;
    const precioOferta = isOferta ? 37.5 : 50;

    const numberWithCommas = (x:any) => {
      x = x.toString();
      var pattern = /(-?\d+)(\d{3})/;
      while (pattern.test(x)) {
        x = x.replace(pattern, "$1,$2");
      }
      return x;
    };

    fetch("https://ipwhois.app/json/?lang=es")
      .then((response) => response.json())
      .then((data) => {
        if (data.currency_code !== "USD") {
          const precioConvertido = (
            data.currency_rates * precioOferta * 1.064
          ).toFixed();
          setPrecio(
            `${data.currency_symbol}${numberWithCommas(precioConvertido)} ${
              data.currency_code
            }`
          );
          setPrecioLocal(
            `Precio en tu moneda local  ` +
              `<img src="${data.country_flag}" width="23px" alt="flag"/>`
          );

          const precioConvertidoTotal = (
            data.currency_rates * precioFull * 1.064
          ).toFixed();
          setPrecioTotal(
            `${data.currency_symbol}${numberWithCommas(precioConvertidoTotal)} ${
              data.currency_code
            }`
          );
        }
      });
  }, []);

  const handleLeadClick = (url: string) => {
    (window as any).fbq?.('track', 'Lead');
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              {/* <Heart className="h-8 w-8 text-blue-600" /> */}
              <img src="/newlogo1.png" alt="Logo" style={{ height: '40px'}} />
              <span className="text-l font-bold text-gray-900">Motivaxion Dogs</span>
            </div>
            <button onClick={() => handleLeadClick(isOferta ? 'https://go.hotmart.com/C95254343F?ap=eaf3' : "https://go.hotmart.com/C95254343F?ap=544e")} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Obtener Curso
            </button>
          </div>
        </div>
      </header>

      {isOferta && (
        <div className="fixed top-0 left-0 w-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-center py-3 z-50 shadow-lg animate-bounce">
          🎉 ¡Felicidades! Acabas de desbloquear un <b>25% OFF</b> exclusivo por tiempo limitado ⏰
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50" style={{marginTop:20}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12" style={{ alignItems:'start'}}>
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Star className="h-4 w-4" />
                  <span>Curso #1 en Guarderías Caninas</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Convierte tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Pasión por los Perros</span> en un Negocio Rentable
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Aprende a crear y gestionar una guardería canina exitosa desde cero. Más de 500 estudiantes ya han transformado sus vidas con nuestro método probado.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4" >
                <button onClick={() => handleLeadClick(isOferta ? 'https://go.hotmart.com/C95254343F?ap=eaf3' : "https://go.hotmart.com/C95254343F?ap=544e")} className="bg-gradient-to-r from-green-600 to-blue-400 text-white px-8 py-4 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg font-semibold flex items-center justify-center space-x-2 animate-pulse-glow">
                  <Play className="h-5 w-5" />
                  <span>Obtener Oferta</span>
                </button>
               {/*  <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all duration-200 text-lg font-semibold">
                  Ver Demo Gratis
                </button> */}
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Garantía 7 días</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span>500+ estudiantes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>4.9/5 estrellas</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Guardería Canina" 
                  className="w-full h-80 object-cover rounded-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">97%</div>
                    <div className="text-sm text-gray-600">Tasa de éxito</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              ¿Te identificas con alguno de estos problemas?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Muchas personas sueñan con tener su propia guardería canina, pero no saben por dónde empezar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "No sabes cómo empezar",
                description: "Tienes la pasión pero te falta la guía paso a paso para convertir tu idea en realidad",
                icon: "❓"
              },
              {
                title: "Miedo a los aspectos legales",
                description: "Los permisos, licencias y regulaciones te parecen un laberinto imposible de navegar",
                icon: "⚖️"
              },
              {
                title: "Preocupaciones financieras",
                description: "No sabes cuánto invertir, cómo calcular precios o hacer que el negocio sea rentable",
                icon: "💰"
              }
            ].map((problem, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-4xl mb-4">{problem.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{problem.title}</h3>
                <p className="text-gray-600">{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src="https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Perros felices en guardería" 
                className="w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                La Solución Completa que Necesitas
              </h2>
              <p className="text-xl text-gray-600">
                Nuestro curso te proporciona todo lo que necesitas para lanzar y hacer crecer tu guardería canina exitosa, sin importar tu experiencia previa.
              </p>
              
              <div className="space-y-4">
                {[
                  "Plan de negocio paso a paso adaptado a guarderías caninas",
                  "Guía completa de permisos y aspectos legales",
                  "Estrategias de marketing probadas para atraer clientes",
                  "Sistema de gestión y precios optimizado",
                  "Protocolos de seguridad y cuidado animal",
                  "Plantillas y documentos listos para usar"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => handleLeadClick(isOferta ? 'https://go.hotmart.com/C95254343F?ap=eaf3' : "https://go.hotmart.com/C95254343F?ap=544e")} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg font-semibold flex items-center space-x-2">
                <span>Acceder al Curso</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Contenido del Curso
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              accederás a 35 lecciones que te llevan de principiante a experto en gestión de guarderías caninas. Estas son algunas de ellas:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                module: "Módulo 1",
                title: "Fundamentos",
                lessons: "5 lecciones",
                icon: BookOpen
              },
              {
                module: "Módulo 2", 
                title: "Definiciones y Etapas",
                lessons: "3 lecciones",
                icon: Award
              },
              {
                module: "Módulo 3",
                title: "Planificación y Diseño",
                lessons: "5 lecciones",
                icon: Shield
              },
              {
                module: "Módulo 4",
                title: "Normativa y Permisos",
                lessons: "3 lecciones",
                icon: Video
              },
              {
                module: "Módulo 5",
                title: "Gestión de la guardería canina campestre",
                lessons: "6 lecciones",
                icon: Users
              },
              {
                module: "Módulo 6",
                title: "Cuidado y Bienestar animal",
                lessons: "5 lecciones",
                icon: Clock
              },
              {
                module: "Módulo 7",
                title: "Marketing y Publicidad",
                lessons: "3 lecciones",
                icon: DollarSign
              },
              {
                module: "Módulo 8",
                title: " Conclusiones y recomendaciones",
                lessons: "3 lecciones",
                icon: Star
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                    <item.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-blue-600 font-medium">{item.module}</div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>{item.lessons}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Lo que dicen nuestros estudiantes
            </h2>
            <p className="text-xl text-gray-600">
              Más de 500 personas han transformado su vida con nuestro curso
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "María González",
                role: "Propietaria de 'Peludos Felices'",
                content: "En 6 meses logré abrir mi guardería y ya tengo lista de espera. El curso me dio toda la confianza y conocimiento que necesitaba.",
                rating: 5,
                image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
              },
              {
                name: "Carlos Martín",
                role: "Ex-empleado corporativo",
                content: "Dejé mi trabajo de oficina para seguir mi pasión. Ahora tengo mi propia guardería y gano más que antes. ¡Mejor decisión de mi vida!",
                rating: 5,
                image: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150"
              },
              {
                name: "Ana Ruiz",
                role: "Emprendedora",
                content: "Los aspectos legales me daban mucho miedo, pero el curso lo explica todo de manera súper clara. Ya tengo todos los permisos en regla.",
                rating: 5,
                image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center space-x-4">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
            Invierte en Tu Futuro Hoy
          </h2>
          
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="text-center space-y-6">
              <div>
                <div className="text-gray-500 text-lg line-through">Valor: {precioTotal} </div>
                <div className="text-5xl font-bold text-gray-900"> {precio} </div>
                <div className="text-gray-600">Precio de lanzamiento</div>
                { isOferta ? (
                  <div className="text-gray-600" style={{fontStyle:'italic'}}>($37.49 usd)</div>
                ) : (
                  <div className="text-gray-600" style={{fontStyle:'italic'}}>($49.99 usd)</div>
                )}
              </div>
              
              <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full inline-block">
                ⏰ Oferta limitada - Solo por 24hs
              </div>

              <div className="space-y-4 text-left">
                <h3 className="text-xl font-semibold text-center mb-6">Todo lo que incluye:</h3>
                {[
                  "10 módulos completos con 35 lecciones",
                  "Plantillas y documentos descargables",
                  "Acceso de por vida al curso",
                  "Soporte directo por email y grupo",
                  "Certificado de finalización",
                  "Actualizaciones gratuitas",
                  "Garantía de 7 días"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => handleLeadClick(isOferta ? 'https://go.hotmart.com/C95254343F?ap=eaf3' : "https://go.hotmart.com/C95254343F?ap=544e")} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6 rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-xl font-bold">
                🎉 OBTENER ACCESO COMPLETO AHORA
              </button>

              <div className="text-center text-gray-600 text-sm space-y-2">
                <div>✅ Pago seguro con cifrado SSL</div>
                <div>✅ Acceso inmediato tras el pago</div>
                <div>✅ Garantía de devolución 7 días</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-gray-600">
              Resolvemos las dudas más comunes sobre el curso
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "¿Necesito experiencia previa con perros?",
                answer: "No es necesario tener experiencia profesional previa. El curso está diseñado para principiantes y te enseña todo desde cero, incluyendo comportamiento canino básico y protocolos de seguridad."
              },
              {
                question: "¿Cuánto tiempo tengo para completar el curso?",
                answer: "Tienes acceso de por vida al curso, por lo que puedes aprender a tu propio ritmo desde donde quieras."
              },
              {
                question: "¿El curso incluye información sobre mi país?",
                answer: "El curso se enfoca principalmente en Colombia, pero incluye una sección sobre cómo investigar regulaciones locales que te ayudará a adaptarlo a tu ubicación específica."
              },
              {
                question: "¿Qué pasa si no estoy satisfecho?",
                answer: "Ofrecemos una garantía de devolución completa de 7 días. Si no estás satisfecho por cualquier motivo, te devolvemos tu dinero sin preguntas."
              },
              {
                question: "¿Recibo soporte después de comprar el curso?",
                answer: "Sí, incluimos soporte por email para resolver dudas específicas sobre el contenido del curso y también contamos con un grupo privado en Telegram."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Tu Guardería Canina te Está Esperando
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            No dejes pasar más tiempo. Cada día que esperas es un día menos construyendo el negocio de tus sueños.
          </p>
          
          <div className="space-y-6">
            <button onClick={() => handleLeadClick(isOferta ? 'https://go.hotmart.com/C95254343F?ap=eaf3' : "https://go.hotmart.com/C95254343F?ap=544e")} className="bg-white text-blue-600 px-12 py-6 rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-xl font-bold">
              🚀 COMENZAR MI GUARDERÍA AHORA
            </button>
            
            <div className="text-blue-100 text-sm">
              ⚡ Acceso inmediato • 💳 Pago seguro • 🔒 Garantía 7 días
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/newlogowhite.png" alt="Logo" style={{ height: '30px'}} />
              <span className="text-l font-bold">Motivaxion Dogs</span>
            </div>
              <p className="text-gray-400">
                Convierte tu pasión por los perros en un negocio exitoso y rentable.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Curso</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Contenido</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Testimonios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* <div>
              <h3 className="text-lg font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reembolsos</a></li>
              </ul>
            </div> */}

            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>infomotivaxiondogs@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <a onClick={() => window.open("https://wa.me/541138951721", "_blank")} style={{ cursor:'pointer' }} >+54 11 3895 1721</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Motivaxion Dogs.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;