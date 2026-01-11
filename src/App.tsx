import React, { useEffect, useMemo, useState } from 'react';
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

  // ✅ Urgencia real (contador 24h) SOLO en oferta
  const [offerExpiresAt, setOfferExpiresAt] = useState<number | null>(null);
  const [offerCountdown, setOfferCountdown] = useState<string>("");

  // ✅ id para scroll a precio
  const PRICING_ID = "pricing";

  useEffect(() => {
    if (window.location.hostname.includes("oferta")) {
      setIsOferta(true);
    }
  }, []);

  // ✅ inicializa deadline (persistente por usuario) cuando es oferta
  useEffect(() => {
    if (!isOferta) return;

    const key = "md_offer_expires_at_v1";
    const stored = localStorage.getItem(key);
    let expiresAt = stored ? Number(stored) : NaN;

    if (!expiresAt || Number.isNaN(expiresAt) || expiresAt < Date.now()) {
      expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24hs
      localStorage.setItem(key, String(expiresAt));
    }

    setOfferExpiresAt(expiresAt);
  }, [isOferta]);

  // ✅ contador en vivo
  useEffect(() => {
    if (!offerExpiresAt) return;

    const tick = () => {
      const diff = offerExpiresAt - Date.now();
      if (diff <= 0) {
        setOfferCountdown("00:00:00");
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n: number) => String(n).padStart(2, "0");
      setOfferCountdown(`${pad(hours)}:${pad(mins)}:${pad(secs)}`);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [offerExpiresAt]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const [precio, setPrecio] = useState("$49.99 USD");
  const [precioLocal, setPrecioLocal] = useState("");
  const [precioTotal, setPrecioTotal] = useState("");

  // ✅ IMPORTANTE: este effect debe depender de isOferta
  useEffect(() => {
    const precioFull = 120;
    const precioOferta = isOferta ? 37.5 : 50;

    const numberWithCommas = (x: any) => {
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
            `${data.currency_symbol}${numberWithCommas(precioConvertido)} ${data.currency_code}`
          );
          setPrecioLocal(
            `Precio en tu moneda local  ` +
              `<img src="${data.country_flag}" width="23px" alt="flag"/>`
          );

          const precioConvertidoTotal = (
            data.currency_rates * precioFull * 1.064
          ).toFixed();
          setPrecioTotal(
            `${data.currency_symbol}${numberWithCommas(precioConvertidoTotal)} ${data.currency_code}`
          );
        } else {
          // ✅ fallback USD consistente
          setPrecio(isOferta ? "$37.50 USD" : "$49.99 USD");
          setPrecioTotal("$120.00 USD");
        }
      })
      .catch(() => {
        // ✅ fallback si falla la API
        setPrecio(isOferta ? "$37.50 USD" : "$49.99 USD");
        setPrecioTotal("$120.00 USD");
      });
  }, [isOferta]);

  const handleLeadClick = (url: string) => {
    (window as any).fbq?.('track', 'Lead');
    window.open(url, "_blank");
  };

  // ✅ CTA que lleva a precio (mejor para cierre)
  const goToPricing = () => {
    const el = document.getElementById(PRICING_ID);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <img src="/newlogo1.png" alt="Logo" style={{ height: '40px'}} />
              <span className="text-l font-bold text-gray-900">Motivaxion Dogs</span>
            </div>

            {/* ✅ CTA header: en oferta empuja a precio (menos fricción); si no, igual */}
            <button
              onClick={goToPricing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Ver Precio
            </button>
          </div>
        </div>
      </header>

      {/* ✅ Banner oferta: SIN bounce (parece spam) + no tapa header */}
      {isOferta && (
        <div className="fixed top-[72px] left-0 w-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-center py-2 z-50 shadow-lg">
          🎉 25% OFF exclusivo <b>por tiempo limitado</b> — vence en <b>{offerCountdown || "24:00:00"}</b>
        </div>
      )}

      {/* ✅ Ajuste de padding top si hay banner */}
      <section
        className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50"
        style={{ marginTop: isOferta ? 52 : 20 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12" style={{ alignItems:'start'}}>
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Star className="h-4 w-4" />
                  <span>Curso #1 en Guarderías Caninas</span>
                </div>

                {/* ✅ HERO NUEVO: más decisión, menos "lindo" */}
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Deja de postergar tu idea de{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    trabajar con perros
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Aprende a crear una guardería canina{" "}
                  <b>organizada</b>, <b>profesional</b> y <b>rentable</b>, incluso si hoy no sabés por dónde empezar.
                </p>

                {/* ✅ micro refuerzo: para tráfico Ads */}
                <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                  <span className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-xl">
                    <CheckCircle className="h-4 w-4 text-green-500" /> Sin experiencia previa
                  </span>
                  <span className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-xl">
                    <CheckCircle className="h-4 w-4 text-green-500" /> Paso a paso
                  </span>
                  {isOferta && (
                    <span className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-2 rounded-xl text-red-700">
                      <Clock className="h-4 w-4" /> 25% OFF • vence en {offerCountdown || "24:00:00"}
                    </span>
                  )}
                </div>
              </div>

              {/* ✅ CTA hero: a precio (mejor conversión) */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={goToPricing}
                  className="bg-gradient-to-r from-green-600 to-blue-400 text-white px-8 py-4 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg font-semibold flex items-center justify-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>{isOferta ? "Ver oferta 25% OFF" : "Ver precio y contenido"}</span>
                </button>
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

      {/* Problem Section (igual) */}
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

      {/* Solution Section (igual, pero CTA baja a precio) */}
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
                Nuestro curso te proporciona todo lo que necesitas para lanzar y hacer crecer tu guardería canina, sin importar tu experiencia previa.
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

              <button
                onClick={goToPricing}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg font-semibold flex items-center space-x-2"
              >
                <span>Ver precio y acceder</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content (igual) */}
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
              { module: "Módulo 1", title: "Fundamentos", lessons: "5 lecciones", icon: BookOpen },
              { module: "Módulo 2", title: "Definiciones y Etapas", lessons: "3 lecciones", icon: Award },
              { module: "Módulo 3", title: "Planificación y Diseño", lessons: "5 lecciones", icon: Shield },
              { module: "Módulo 4", title: "Normativa y Permisos", lessons: "3 lecciones", icon: Video },
              { module: "Módulo 5", title: "Gestión de la guardería canina campestre", lessons: "6 lecciones", icon: Users },
              { module: "Módulo 6", title: "Cuidado y Bienestar animal", lessons: "5 lecciones", icon: Clock },
              { module: "Módulo 7", title: "Marketing y Publicidad", lessons: "3 lecciones", icon: DollarSign },
              { module: "Módulo 8", title: "Conclusiones y recomendaciones", lessons: "3 lecciones", icon: Star },
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

      {/* ✅ NUEVO BLOQUE: Este curso es / no es para vos (ANTES de precios) */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-50 border border-green-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Este curso es para vos si:</h3>
              <div className="space-y-3">
                {[
                  "Amás a los perros y querés trabajar con ellos de forma profesional",
                  "Tenés la idea hace tiempo, pero la venís postergando",
                  "Querés un negocio ordenado (no improvisar ni “probar suerte”)",
                  "Necesitás una guía clara desde cero, paso a paso",
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-gray-700">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Este curso NO es para vos si:</h3>
              <div className="space-y-3">
                {[
                  "Buscás dinero rápido sin aprender ni aplicar",
                  "No estás dispuesto a seguir un plan y hacer las cosas bien",
                  "Solo querés mirar sin intención real de empezar",
                  "Te incomoda asumir responsabilidad por el cuidado animal",
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <span className="text-gray-700">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ✅ micro CTA */}
          <div className="text-center mt-10">
            <button
              onClick={goToPricing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg font-bold"
            >
              Ver precio y acceder
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials (igual) */}
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
                content:
                  "Yo estaba exactamente en ese punto: quería trabajar con perros, pero no sabía por dónde empezar. El curso me dio claridad, orden y la confianza para dar el primer paso.",
                rating: 5,
                image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
              },
              {
                name: "Carlos Martín",
                role: "Ex-empleado corporativo",
                content:
                  "Dejé mi trabajo de oficina para seguir mi pasión. Hoy tengo un plan claro, procesos y una forma ordenada de captar clientes. ¡Valió totalmente la pena!",
                rating: 5,
                image: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150"
              },
              {
                name: "Ana Ruiz",
                role: "Emprendedora",
                content:
                  "Los aspectos legales me daban miedo, pero el curso lo explica de forma muy clara. Me ayudó a entender qué pasos seguir y qué revisar en mi zona.",
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

      {/* ✅ Pricing con ID para scroll */}
      <section id={PRICING_ID} className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
            Tomá una decisión simple hoy
          </h2>

          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="text-center space-y-6">
              <div>
                <div className="text-gray-500 text-lg line-through" style={{ fontStyle: 'italic' }}>
                  {precioTotal ? precioTotal : "$120.00 USD"}
                </div>

                <div className="text-5xl font-bold text-gray-900">{precio}</div>

                <div className="text-gray-600">
                  {isOferta ? "25% OFF EXTRA activado — por tiempo limitado" : "Precio de lanzamiento"}
                </div>
              </div>

              {/* ✅ Urgencia real SOLO oferta */}
              {isOferta ? (
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full inline-block">
                  ⏰ Tu 25% OFF vence en <b>{offerCountdown || "24:00:00"}</b>
                </div>
              ) : (
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full inline-block">
                  ✅ Acceso inmediato + garantía 7 días
                </div>
              )}

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

              {/* ✅ Botón de compra directo */}
              <button
                onClick={() =>
                  handleLeadClick(
                    isOferta
                      ? 'https://go.hotmart.com/C95254343F?ap=eaf3'
                      : "https://go.hotmart.com/C95254343F?ap=544e"
                  )
                }
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6 rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-xl font-bold"
              >
                {isOferta ? "🎉 Aprovechar 25% OFF y acceder ahora" : "🚀 Obtener acceso completo ahora"}
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

      {/* FAQ (igual) */}
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
                answer:
                  "No es necesario tener experiencia profesional previa. El curso está diseñado para principiantes y te enseña todo desde cero, incluyendo comportamiento canino básico y protocolos de seguridad."
              },
              {
                question: "¿Cuánto tiempo tengo para completar el curso?",
                answer: "Tienes acceso de por vida al curso, por lo que puedes aprender a tu propio ritmo desde donde quieras."
              },
              {
                question: "¿El curso incluye información sobre mi país?",
                answer:
                  "El curso se enfoca principalmente en Colombia, pero incluye una sección sobre cómo investigar regulaciones locales que te ayudará a adaptarlo a tu ubicación específica."
              },
              {
                question: "¿Qué pasa si no estoy satisfecho?",
                answer:
                  "Ofrecemos una garantía de devolución completa de 7 días. Si no estás satisfecho por cualquier motivo, te devolvemos tu dinero sin preguntas."
              },
              {
                question: "¿Recibo soporte después de comprar el curso?",
                answer:
                  "Sí, incluimos soporte por email para resolver dudas específicas sobre el contenido del curso y también contamos con un grupo privado en Telegram."
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

      {/* Final CTA (ajustado: lleva a precio o compra) */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Tu guardería canina puede empezar con un primer paso
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Menos dudas. Más claridad. Empezá con una guía profesional y ordenada.
          </p>

          <div className="space-y-6">
            <button
              onClick={goToPricing}
              className="bg-white text-blue-600 px-12 py-6 rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-xl font-bold"
            >
              {isOferta ? "🎁 Ver mi 25% OFF" : "🚀 Ver precio y acceder"}
            </button>

            <div className="text-blue-100 text-sm">
              ⚡ Acceso inmediato • 💳 Pago seguro • 🔒 Garantía 7 días
            </div>
          </div>
        </div>
      </section>

      {/* Footer (igual) */}
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

            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>infomotivaxiondogs@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <a onClick={() => window.open("https://wa.me/541138951721", "_blank")} style={{ cursor:'pointer' }}>
                    +54 11 3895 1721
                  </a>
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
