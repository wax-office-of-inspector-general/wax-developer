---
title: Bienvenidos al portal WAX Developer
breadcrumb: Start
order: 1
---

<ContentColumns :ltr="false">
  <template v-slot:first>
    <div>
      <h1>Portal de Desarrolladores de WAX</h1>
      <p>Nuestra misión es capacitar a desarrolladores como tú para construir aplicaciones innovadoras, mercados de NFT, herramientas de finanzas descentralizadas (DeFi) y experiencias impulsadas por la comunidad en la cadena de bloques de WAX. Con una infraestructura fácil de usar, capacidades técnicas sólidas y una comunidad próspera, WAX proporciona el entorno perfecto para convertir tus ideas en realidad.
      </p>
      <p>
      Dentro del Portal de Desarrolladores de WAX, encontrarás una gran cantidad de recursos que te guiarán en tu trayectoria de desarrollo. Desde documentación detallada y tutoriales hasta ejemplos prácticos y mejores prácticas, lo tenemos cubierto. Explora los conceptos fundamentales de la cadena de bloques de WAX, aprende sobre su mecanismo de consenso, comprende el papel del token WAXP y descubre cómo aprovechar las características de gobernanza e interoperabilidad de WAX.
      </p>
    </div>
  </template>
  <template v-slot:second>
    <div>
      <br>
      <br>
      <br>
      <ImageWithAspect src="/assets/images/front-cube.png" />
    </div>
  </template>
</ContentColumns>

<ContentLinks>
  <template v-slot:content>
    <h1>APRENDER</h1>
    <p>Amplía tu comprensión de la tecnología de cadena de bloques y los detalles del ecosistema de WAX. Descubre los mecanismos detrás del consenso de WAX, explora el desarrollo de contratos inteligentes y domina herramientas esenciales como Cloud Wallet. Sumérgete en nuestros recursos seleccionados y empodérate con conocimientos profundos para navegar en el mundo de la cadena de bloques con confianza.</p>
  </template>
  <template v-slot:items>
    <ContentLinkItem href="/learn/about-wax/" text="Acerca de WAX" />
    <ContentLinkItem href="/build/cloud-wallet/" text="Mi Cloud Wallet" />
  </template>
</ContentLinks>

<ContentLinks>
  <template v-slot:content>
    <h1>CONSTRUIR</h1>
    <p>Desarrolla tus habilidades de desarrollo con la sección de Construir. Sumérgete en el desarrollo de contratos inteligentes y dApps, aprovecha las poderosas herramientas del ecosistema y da rienda suelta a tu creatividad con guías, tutoriales y recursos completos. Construye aplicaciones innovadoras en la cadena de bloques y da vida a tus ideas en la plataforma WAX.</p>
  </template>
  <template v-slot:items>
    <ContentLinkItem href="/build/dapp-development/docker-setup/" text="Ejecutar WAX en Docker - Inicio rápido" />
    <ContentLinkItem href="/build/dapp-development/wax-blockchain-setup/" text="Ejecutar WAX nativamente" />
    <ContentLinkItem href="/build/dapp-development/wax-cdt/" text="Conoce el Conjunto de Herramientas de Desarrollo de Contratos WAX (WAX-CDT)" />
    <ContentLinkItem href="/build/dapp-development/setup-local-dapp

environment/" text="Configurar un Entorno Local de dApp" />
    <ContentLinkItem href="/build/dapp-development/smart-contract-quickstart/" text="Inicio rápido de Contratos Inteligentes" />
    <ContentLinkItem href="/build/api-reference/rpc_api" text="API RPC de WAX" />
    <ContentLinkItem href="/build/api-reference/cdt_api" text="API de WAX-CDT" />
  </template>
</ContentLinks>

<ContentLinks>
  <template v-slot:content>
    <h1>OPERAR</h1>
    <p>Optimiza tus operaciones en la cadena de bloques con la sección de Operar. Domina la gestión de infraestructura de cadena de bloques, explora la operación de nodos y proporciona API esenciales. Mejora la seguridad, optimiza el rendimiento y asegura el funcionamiento fluido de tu ecosistema WAX. Aprovecha el poder de la operación de la cadena de bloques con nuestras guías y recursos completos.</p>
  </template>
  <template v-slot:items>
    <ContentLinkItem href="/operate/wax-bp/" text="Conceptos básicos de Operador de Nodos" />
    <ContentLinkItem href="/operate/atomic-assets/" text="Configurar y Ejecutar tu Propia API de Atomic Assets" />
    <ContentLinkItem href="/operate/wax-infrastructure/" text="Guías Detalladas para Operadores de Nodos y API" />
  </template>
</ContentLinks>

<ContentLinks>
  <template v-slot:content>
    <h1>CREAR</h1>
    <p>Libera tu creatividad en la sección de Crear. Descubre las herramientas y posibilidades de la cadena de bloques de WAX para lanzar activos digitales, NFT y herramientas impulsadas por la comunidad. Aprende sobre herramientas de creación, mercados, opciones de DeFi y más para enriquecer y cautivar a tu comunidad. Da vida a tu visión en la plataforma WAX.</p>
  </template>
  <template v-slot:items>
    <ContentLinkItem href="/create/awesome-wax/" text="Awesome WAX" />
    <ContentLinkItem href="/create/docs/" text="¡Ayúdanos a mejorar la documentación!" />
  </template>
</ContentLinks>

<ChildTableOfContents :max="2" title="Más dentro de esta sección" />