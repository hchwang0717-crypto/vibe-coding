document.documentElement.classList.add("jsEnabled");

const typingText = document.getElementById("typingText");
const typingMessages = [
  "신뢰 가능한 CAE 시스템을 설계합니다.",
  "OpenFOAM 기반 SaaS를 준비합니다.",
  "정확도와 재현성을 우선합니다."
];

let typingMessageIndex = 0;
let typingCharIndex = 0;
let isDeleting = false;

function runTypingEffect() {
  if (!typingText) {
    return;
  }

  const currentMessage = typingMessages[typingMessageIndex];
  const displayedText = currentMessage.slice(0, typingCharIndex);
  typingText.textContent = displayedText;

  let typingSpeed = isDeleting ? 45 : 90;

  if (!isDeleting && typingCharIndex < currentMessage.length) {
    typingCharIndex += 1;
  } else if (isDeleting && typingCharIndex > 0) {
    typingCharIndex -= 1;
  } else if (!isDeleting && typingCharIndex === currentMessage.length) {
    typingSpeed = 1400;
    isDeleting = true;
  } else {
    isDeleting = false;
    typingMessageIndex = (typingMessageIndex + 1) % typingMessages.length;
    typingSpeed = 300;
  }

  window.setTimeout(runTypingEffect, typingSpeed);
}

runTypingEffect();

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, entryIndex) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => {
            entry.target.classList.add("visible");
          }, entryIndex * 120);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

const profileCard = document.getElementById("profileCard");

if (profileCard) {
  profileCard.addEventListener("mousemove", (event) => {
    const rect = profileCard.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = (event.clientX - centerX) / 28;
    const rotateX = (centerY - event.clientY) / 28;

    profileCard.style.transform =
      `perspective(1200px) rotateX(${rotateX * 0.5}deg) rotateY(${rotateY * 0.5}deg)`;
    profileCard.style.boxShadow = "0 28px 80px rgba(0, 0, 0, 0.42)";
  });

  profileCard.addEventListener("mouseleave", () => {
    profileCard.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
    profileCard.style.boxShadow = "0 24px 70px rgba(0, 0, 0, 0.35)";
  });
}

const currentTime = document.getElementById("currentTime");

function updateCurrentTime() {
  if (!currentTime) {
    return;
  }

  const now = new Date();
  const timeText = now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  currentTime.textContent = timeText;
}

updateCurrentTime();
window.setInterval(updateCurrentTime, 1000);

const copyEmailButton = document.getElementById("copyEmailButton");
const emailText = document.getElementById("emailText");
const toast = document.getElementById("toast");

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

if (copyEmailButton && emailText) {
  copyEmailButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(emailText.textContent.trim());
      showToast("이메일이 복사되었습니다.");
    } catch (error) {
      showToast("복사에 실패했습니다.");
    }
  });
}

const particleCanvas = document.getElementById("particleCanvas");
const particleContext = particleCanvas ? particleCanvas.getContext("2d") : null;
let particles = [];

function resizeCanvas() {
  if (!particleCanvas) {
    return;
  }

  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
  createParticles();
}

function createParticles() {
  if (!particleCanvas) {
    return;
  }

  const particleCount = Math.min(70, Math.floor(window.innerWidth / 22));
  particles = [];

  for (let i = 0; i < particleCount; i += 1) {
    particles.push({
      x: Math.random() * particleCanvas.width,
      y: Math.random() * particleCanvas.height,
      radius: Math.random() * 1.8 + 0.5,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.45 + 0.08
    });
  }
}

function animateParticles() {
  if (!particleCanvas || !particleContext) {
    return;
  }

  particleContext.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

  particles.forEach((particle) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < 0) particle.x = particleCanvas.width;
    if (particle.x > particleCanvas.width) particle.x = 0;
    if (particle.y < 0) particle.y = particleCanvas.height;
    if (particle.y > particleCanvas.height) particle.y = 0;

    particleContext.beginPath();
    particleContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    particleContext.fillStyle = `rgba(125, 211, 252, ${particle.alpha})`;
    particleContext.fill();
  });

  requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
animateParticles();

const heroSlides = document.querySelectorAll(".heroSlide");
let heroSlideIndex = 0;

function runHeroSlideshow() {
  if (heroSlides.length === 0) {
    return;
  }

  heroSlides[heroSlideIndex].classList.remove("isActive");
  heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;
  heroSlides[heroSlideIndex].classList.add("isActive");
}

if (heroSlides.length > 1) {
  window.setInterval(runHeroSlideshow, 3000);
}