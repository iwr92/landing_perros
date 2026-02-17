import React, { useEffect, useMemo, useState } from 'react';
import {
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
  Video,
  Download,
  Sparkles
} from 'lucide-react';

function App() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ✅ Detecta qué versión mostrar según subdominio
  const [isOferta, setIsOferta] = useState(false);
  const [isEbook, setIsEbook] = useState(false);

  // ✅ Urgencia real (contador 24h) SOLO en oferta
  const [offerExpiresAt, setOfferExpiresAt] = useState<number | null>(null);
  const [offerCountdown, setOfferCountdown] = useState<string>("");

  // ✅ id para scroll a precio
  const PRICING_ID = "pricing";

  useEffect(() => {
    const host = window.location.hostname;
    if (host.includes("oferta")) setIsOferta(true);
    if (host.includes("ebook")) setIsEbook(true);
  }, []);

  // ✅ inicializa deadline (persistente por usuario) cuando es oferta
  useEffect(() => {
    if (!isOferta) return;

    const key = "md_offer_expires_at_v1";
    const stored = localStorage.getItem(key);
    let expiresAt = stored ? Number(stored) : NaN;

    if (!expiresAt || Number.isNaN(expiresAt) || expiresAt < Date.now()) {
      expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24h
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
  console.log({ precio, precioLocal, precioTotal });

  // ✅ Links (cambia estos 2 del ebook cuando los tengas)
  const HOTMART_CURSO_NORMAL = "https://go.hotmart.com/C95254343F?ap=544e";
  const HOTMART_CURSO_OFERTA = "https://go.hotmart.com/C95254343F?ap=eaf3";

  const HOTMART_EBOOK_NORMAL = "https://go.hotmart.com/REEMPLAZAR_EBOOK_NORMAL";
  const HOTMART_EBOOK_OFERTA = "https://go.hotmart.com/REEMPLAZAR_EBOOK_OFERTA";

  useEffect(() => {
  // Precios base
  const precioFullCurso = 120;
  const precioCurso = isOferta ? 37.5 : 50;

  const precioFullEbook = 27;
  const precioEbook = 19;

  const chosenFull = isEbook ? precioFullEbook : precioFullCurso;
  const chosen = isEbook ? precioEbook : precioCurso;

  const numberWithCommas = (x: number | string) => {
    const s = String(x);
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const setFallbackUSD = () => {
    setPrecio(`$${Number(chosen).toFixed(2)} USD`);
    setPrecioTotal(`$${Number(chosenFull).toFixed(2)} USD`);
    setPrecioLocal(`Precio en USD`);
  };

  fetch("https://ipwhois.app/json/?lang=es")
    .then((r) => r.json())
    .then((data) => {
      const success = data?.success === true;

      const code = data?.currency_code;
      const symbol = data?.currency_symbol ?? "";
      const rate = Number(data?.currency_rates); // <- fuerza número

      // Si falla la respuesta, faltan campos, o el rate no es válido => fallback
      if (!success || !code || !Number.isFinite(rate) || rate <= 0) {
        setFallbackUSD();
        return;
      }

      // Si es USD, no conviertas
      if (code === "USD") {
        setFallbackUSD();
        return;
      }

      // Conversión (tu multiplicador 1.064)
      const factor = 1.064;

      const local = Math.round(rate * Number(chosen) * factor);
      const total = Math.round(rate * Number(chosenFull) * factor);

      // Si por alguna razón da NaN, fallback
      if (!Number.isFinite(local) || !Number.isFinite(total)) {
        setFallbackUSD();
        return;
      }

      setPrecio(`${symbol}${numberWithCommas(local)} ${code}`);
      setPrecioTotal(`${symbol}${numberWithCommas(total)} ${code}`);
      setPrecioLocal(
        `Precio en tu moneda local <img src="${data?.country_flag}" width="23px" alt="flag"/>`
      );
    })
    .catch(() => {
      setFallbackUSD();
    });
}, [isOferta, isEbook]);


  const handleLeadClick = (url: string) => {
    (window as any).fbq?.('track', 'Lead');
    window.open(url, "_blank");
  };

  // ✅ CTA que lleva a precio
  const goToPricing = () => {
    const el = document.getElementById(PRICING_ID);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ✅ Contenido dinámico (Curso vs Ebook)
  const page = useMemo(() => {
    if (!isEbook) {
      return {
        badge: "Curso #1 en Guarderías Caninas",
        heroTitleA: "Deja de postergar tu idea de",
        heroTitleB: "trabajar con perros",
        heroDesc:
          "Aprende a crear una guardería canina organizada, profesional y rentable, incluso si hoy no sabes por dónde empezar.",
        heroCta: isOferta ? "Ver oferta 25% OFF" : "Ver precio y contenido",
        heroImg:
          "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1200",
        solutionImg:
          "https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=1200",
        pricingTitle: "Toma una decisión simple hoy",
        pricingSub: isOferta ? "25% OFF EXTRA activado — por tiempo limitado" : "Precio de lanzamiento",
        buyText: isOferta ? "🎉 Aprovechar 25% OFF y acceder ahora" : "🚀 Obtener acceso completo ahora",
        buyUrl: isOferta ? HOTMART_CURSO_OFERTA : HOTMART_CURSO_NORMAL,
        includes: [
          "10 módulos completos con 35 lecciones",
          "Plantillas y documentos descargables",
          "Acceso de por vida al curso",
          "Soporte directo por email y grupo",
          "Certificado de finalización",
          "Actualizaciones gratuitas",
          "Garantía de 7 días"
        ],
      };
    }

    // ✅ EBOOK
    return {
      badge: "Ebook práctico + checklist + plantillas",
      heroTitleA: "Cómo montar una guardería canina rentable",
      heroTitleB: "(desde cero y sin errores)",
      heroDesc:
        "Una guía directa, clara y aplicable para planear, organizar y lanzar tu guardería con orden, seguridad y números realistas. Ideal si quieres empezar bien y evitar improvisaciones.",
      heroCta: isOferta ? "Ver oferta del ebook" : "Ver precio del ebook",
      heroImg:
        "https://i.ibb.co/TDjDgf4r/english-setter-dog-greenhouse.jpg",
      solutionImg:
        "https://i.ibb.co/1GNzsjnG/owner-petting-dog-park.jpg",
      pricingTitle: "Llévate la guía y avanza con claridad",
      pricingSub: isOferta ? "Oferta activada — cupo/tiempo limitado" : "Acceso inmediato (descarga al instante)",
      buyText: isOferta ? "🎁 Comprar ebook con descuento" : "📘 Comprar ebook ahora",
      buyUrl: isOferta ? HOTMART_EBOOK_OFERTA : HOTMART_EBOOK_NORMAL,
      includes: [
        "Guía paso a paso (sin relleno)",
        "Checklist de requisitos y preparación",
        "Plantillas listas para usar",
        "Estructura de precios y costos (base)",
        "Protocolos de operación y manejo del grupo",
        "Errores comunes y cómo evitarlos",
        "Garantía de 7 días"
      ],
    };
  }, [isEbook, isOferta]);

  // ✅ Secciones dinámicas para Ebook (problemas + solución + bullets)
  const problems = useMemo(() => {
    if (!isEbook) {
      return [
        {
          title: "No sabes cómo empezar",
          description: "Tienes la pasión pero te falta una guía paso a paso para convertir tu idea en realidad.",
          icon: "❓"
        },
        {
          title: "Miedo a los aspectos legales",
          description: "Permisos, licencias y regulaciones se sienten como un laberinto difícil de entender.",
          icon: "⚖️"
        },
        {
          title: "Preocupaciones financieras",
          description: "No sabes cuánto invertir, cómo poner precios o qué hacer para que sea rentable.",
          icon: "💰"
        }
      ];
    }

    return [
      {
        title: "Quieres hacerlo bien desde el día 1",
        description: "No quieres improvisar ni “ver qué pasa”. Quieres un plan claro, ordenado y aplicable.",
        icon: "🧠"
      },
      {
        title: "Te preocupa la seguridad y el manejo del grupo",
        description: "Sabes que no es solo “perros sueltos”. Necesitas rutinas, supervisión y control.",
        icon: "🛡️"
      },
      {
        title: "Quieres números realistas",
        description: "Quieres entender costos, precios y qué necesitas para que el proyecto sea sostenible.",
        icon: "📊"
      }
    ];
  }, [isEbook]);

  const solutionBullets = useMemo(() => {
    if (!isEbook) {
      return [
        "Plan de negocio paso a paso adaptado a guarderías caninas",
        "Guía completa de permisos y aspectos legales",
        "Estrategias de marketing probadas para atraer clientes",
        "Sistema de gestión y precios optimizado",
        "Protocolos de seguridad y cuidado animal",
        "Plantillas y documentos listos para usar"
      ];
    }

    return [
      "Qué es (y qué no es) una guardería canina profesional",
      "Cómo organizar el día, rutinas, descanso y manejo del grupo",
      "Checklist de lo básico para empezar con orden",
      "Cómo definir servicios y precios sin regalar tu trabajo",
      "Errores comunes que cuestan dinero y reputación",
      "Plantillas y listas para implementar más rápido"
    ];
  }, [isEbook]);

  const faq = useMemo(() => {
    if (!isEbook) {
      return [
        {
          question: "¿Necesito experiencia previa con perros?",
          answer:
            "No es necesario tener experiencia profesional previa. El curso está diseñado para principiantes y te enseña todo desde cero, incluyendo fundamentos y protocolos de seguridad."
        },
        {
          question: "¿Cuánto tiempo tengo para completar el curso?",
          answer: "Tienes acceso de por vida al curso, por lo que puedes avanzar a tu ritmo."
        },
        {
          question: "¿El curso incluye información sobre mi país?",
          answer:
            "El curso se enfoca principalmente en Colombia, pero incluye una sección sobre cómo investigar regulaciones locales para adaptarlo a tu ubicación."
        },
        {
          question: "¿Qué pasa si no estoy satisfecho?",
          answer:
            "Ofrecemos garantía de devolución de 7 días. Si no estás satisfecho, puedes solicitar el reembolso."
        },
        {
          question: "¿Recibo soporte después de comprar el curso?",
          answer:
            "Sí, incluimos soporte por email y también contamos con un grupo privado."
        }
      ];
    }

    return [
      {
        question: "¿El ebook sirve si todavía no tengo local?",
        answer:
          "Sí. La guía está pensada para ayudarte a planear desde cero: servicios, organización, costos y pasos para empezar con claridad (incluye opciones para iniciar en pequeño)."
      },
      {
        question: "¿Incluye plantillas o recursos descargables?",
        answer:
          "Sí. Incluye checklist y plantillas listas para usar para que avances más rápido y con orden."
      },
      {
        question: "¿Cuándo lo recibo?",
        answer:
          "El acceso es inmediato. Tras el pago podrás descargarlo al instante."
      },
      {
        question: "¿Sirve para mi país?",
        answer:
          "La guía es aplicable a cualquier país porque se centra en estructura operativa, organización, precios y buenas prácticas. Para temas legales, te orienta a cómo validar requisitos en tu zona."
      },
      {
        question: "¿Tiene garantía?",
        answer:
          "Sí. Tienes 7 días de garantía para solicitar reembolso si no es lo que esperabas."
      }
    ];
  }, [isEbook]);

  const showCourseModules = !isEbook; // el ebook no necesita módulos

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

            <button
              onClick={goToPricing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Ver Precio
            </button>
          </div>
        </div>
      </header>

      {/* Banner oferta */}
      {isOferta && (
        <div className="fixed top-[72px] left-0 w-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-center py-2 z-50 shadow-lg">
          🎉 Descuento por tiempo limitado — vence en <b>{offerCountdown || "24:00:00"}</b>
        </div>
      )}

      {/* Hero */}
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
                  <span>{page.badge}</span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {page.heroTitleA}{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    {page.heroTitleB}
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  {page.heroDesc}
                </p>

                <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                  <span className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-xl">
                    <CheckCircle className="h-4 w-4 text-green-500" /> Paso a paso
                  </span>
                  <span className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-xl">
                    <CheckCircle className="h-4 w-4 text-green-500" /> Sin improvisar
                  </span>
                  {isEbook && (
                    <span className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-xl">
                      <Download className="h-4 w-4 text-blue-600" /> Descarga inmediata
                    </span>
                  )}
                  {isOferta && (
                    <span className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-2 rounded-xl text-red-700">
                      <Clock className="h-4 w-4" /> Descuento • vence en {offerCountdown || "24:00:00"}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={goToPricing}
                  className="bg-gradient-to-r from-green-600 to-blue-400 text-white px-8 py-4 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg font-semibold flex items-center justify-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>{page.heroCta}</span>
                </button>

                {isEbook && (
                  <button
                    onClick={() => handleLeadClick(page.buyUrl)}
                    className="bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 text-lg font-semibold flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span>Quiero la guía ahora</span>
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Garantía 7 días</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span>{isEbook ? "Miles de descargas" : "500+ estudiantes"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>4.9/5</span>
                </div>
              </div>
            </div>

            {/* Lado derecho: imagen + mock ebook */}
            <div className="relative">
              <div className="rounded-3xl shadow-2xl">
                <img
                  src={page.heroImg}
                  alt={isEbook ? "Ebook guardería canina" : "Guardería Canina"}
                  className="w-full h-80 object-cover rounded-2xl"
                />

                {isEbook && (
                  <div className="absolute -bottom-8 -right-6 bg-white p-5 rounded-2xl shadow-xl w-[270px]">
                    <div className="flex items-start gap-3">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-12 h-12 rounded-xl flex items-center justify-center">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 leading-tight">
                          Ebook: Guardería Canina Rentable
                        </div>
                        <div className="text-sm text-gray-600">
                          Checklist + plantillas + guía práctica
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-600">
                      Descarga inmediata • Garantía 7 días
                    </div>
                  </div>
                )}

                {!isEbook && (
                  <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">97%</div>
                      <div className="text-sm text-gray-600">Tasa de éxito</div>
                    </div>
                  </div>
                )}
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
              {isEbook ? "Si esto te suena familiar, esta guía es para ti" : "¿Te identificas con alguno de estos problemas?"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {isEbook
                ? "Cuando empiezas sin estructura, los errores cuestan dinero, tiempo y reputación. Evítalos con un plan claro."
                : "Muchas personas sueñan con tener su propia guardería canina, pero no saben por dónde empezar."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((problem, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-4xl mb-4">{problem.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{problem.title}</h3>
                <p className="text-gray-600">{problem.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={goToPricing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg font-bold"
            >
              {isEbook ? "Ver precio del ebook" : "Ver precio y acceder"}
            </button>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src={page.solutionImg}
                alt="Solución"
                className="w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {isEbook ? "Una guía práctica para avanzar con seguridad" : "La Solución Completa que Necesitas"}
              </h2>

              <p className="text-xl text-gray-600">
                {isEbook
                  ? "Esta guía te ayuda a ordenar tus ideas, definir un plan realista y comenzar con estructura. Ideal si quieres claridad antes de invertir."
                  : "Nuestro curso te proporciona todo lo que necesitas para lanzar y hacer crecer tu guardería canina, sin importar tu experiencia previa."}
              </p>

              <div className="space-y-4">
                {solutionBullets.map((benefit, index) => (
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
                <span>{isEbook ? "Ver precio del ebook" : "Ver precio y acceder"}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content (solo curso) */}
      {showCourseModules && (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Contenido del Curso
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Accederás a 35 lecciones que te llevan de principiante a experto en gestión de guarderías caninas. Estas son algunas de ellas:
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
      )}

      {/* ✅ Bloque: para ti / no para ti */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-50 border border-green-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {isEbook ? "Este ebook es para ti si:" : "Este curso es para ti si:"}
              </h3>
              <div className="space-y-3">
                {[
                  "Amas a los perros y quieres trabajar con ellos de forma profesional",
                  "Tienes la idea hace tiempo, pero te falta una guía clara",
                  "Quieres un negocio ordenado (sin improvisar)",
                  "Necesitas pasos concretos para avanzar con seguridad",
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-gray-700">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {isEbook ? "Este ebook NO es para ti si:" : "Este curso NO es para ti si:"}
              </h3>
              <div className="space-y-3">
                {[
                  "Buscas resultados sin leer ni aplicar",
                  "No estás dispuesto a seguir un plan",
                  "Solo quieres “ver” sin intención real de empezar",
                  "Te incomoda asumir responsabilidad por el bienestar animal",
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <span className="text-gray-700">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              onClick={goToPricing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg font-bold"
            >
              {isEbook ? "Quiero el ebook" : "Ver precio y acceder"}
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials (mantengo igual para no perder prueba social) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {isEbook ? "Lo que la gente valora de la guía" : "Lo que dicen nuestros estudiantes"}
            </h2>
            <p className="text-xl text-gray-600">
              {isEbook ? "Claridad, orden y pasos concretos para avanzar." : "Más de 500 personas han transformado su vida con nuestro curso"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "María González",
                role: isEbook ? "Emprendedora" : "Propietaria de 'Peludos Felices'",
                content:
                  isEbook
                    ? "La guía me dio estructura. Dejé de dar vueltas y por fin entendí qué pasos seguir y qué cosas debía preparar primero."
                    : "Yo estaba exactamente en ese punto: quería trabajar con perros, pero no sabía por dónde empezar. El curso me dio claridad, orden y confianza para dar el primer paso.",
                rating: 5,
                image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
              },
              {
                name: "Carlos Martín",
                role: isEbook ? "Nuevo emprendedor" : "Ex-empleado corporativo",
                content:
                  isEbook
                    ? "Lo mejor es que es práctico. Checklist, plantillas y explicaciones claras. Me ahorró tiempo y errores."
                    : "Dejé mi trabajo de oficina para seguir mi pasión. Hoy tengo un plan claro, procesos y una forma ordenada de captar clientes. Valió totalmente la pena.",
                rating: 5,
                image: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150"
              },
              {
                name: "Ana Ruiz",
                role: isEbook ? "Cuidadora canina" : "Emprendedora",
                content:
                  isEbook
                    ? "Me ayudó a entender qué es realmente una guardería canina profesional y cómo manejar grupos sin caos."
                    : "Los aspectos legales me daban miedo, pero el curso lo explica de forma muy clara. Me ayudó a entender qué pasos seguir y qué revisar en mi zona.",
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
      <section id={PRICING_ID} className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
            {page.pricingTitle}
          </h2>

          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="text-center space-y-6">
              <div>
                <div className="text-gray-500 text-lg line-through" style={{ fontStyle: 'italic' }}>
                  {precioTotal ? precioTotal : (isEbook ? "$39.00 USD" : "$120.00 USD")}
                </div>

                <div className="text-5xl font-bold text-gray-900">{precio}</div>

                <div className="text-gray-600">
                  {page.pricingSub}
                </div>

                {/* Si quieres mostrar precio local */}
                {precioLocal && (
                  <div
                    className="text-sm text-gray-500 mt-2"
                    dangerouslySetInnerHTML={{ __html: precioLocal }}
                  />
                )}
              </div>

              {/* Urgencia real SOLO oferta */}
              {isOferta ? (
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full inline-block">
                  ⏰ Tu descuento vence en <b>{offerCountdown || "24:00:00"}</b>
                </div>
              ) : (
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full inline-block">
                  ✅ Acceso inmediato + garantía 7 días
                </div>
              )}

              <div className="space-y-4 text-left">
                <h3 className="text-xl font-semibold text-center mb-6">Todo lo que incluye:</h3>
                {page.includes.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleLeadClick(page.buyUrl)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6 rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-xl font-bold"
              >
                {page.buyText}
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
              {isEbook ? "Resolvemos dudas sobre el ebook y la descarga." : "Resolvemos las dudas más comunes sobre el curso"}
            </p>
          </div>

          <div className="space-y-4">
            {faq.map((item, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-900">{item.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{item.answer}</p>
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
            {isEbook ? "Empieza con claridad (y evita errores caros)" : "Tu guardería canina puede empezar con un primer paso"}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {isEbook
              ? "Si llevas tiempo con la idea, este ebook te da estructura y un plan aplicable para avanzar hoy."
              : "Menos dudas. Más claridad. Empieza con una guía profesional y ordenada."}
          </p>

          <div className="space-y-6">
            <button
              onClick={goToPricing}
              className="bg-white text-blue-600 px-12 py-6 rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-xl font-bold"
            >
              {isEbook ? "📘 Ver precio del ebook" : (isOferta ? "🎁 Ver mi 25% OFF" : "🚀 Ver precio y acceder")}
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
                {isEbook
                  ? "Guías prácticas para convertir tu pasión por los perros en un proyecto real y sostenible."
                  : "Convierte tu pasión por los perros en un negocio exitoso y rentable."}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" onClick={(e)=>{e.preventDefault(); window.scrollTo({top:0, behavior:"smooth"})}} className="hover:text-white transition-colors">Inicio</a></li>
                <li><a href="#" onClick={(e)=>{e.preventDefault(); goToPricing()}} className="hover:text-white transition-colors">Precio</a></li>
                <li><a href="#" onClick={(e)=>{e.preventDefault();}} className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>infomotivaxiondogs@gmail.com</span>
                </div>
                {/* <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <a onClick={() => window.open("https://wa.me/541138951721", "_blank")} style={{ cursor:'pointer' }}>
                    +54 11 3895 1721
                  </a>
                </div> */}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Motivaxion Dogs.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
