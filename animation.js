// animation.js 파일 전체 내용

// --- ISEE 제목 요소 선택 ---
// ISEE와 ISEE2 모두 선택
let Isee = document.querySelectorAll("#ISEE, #ISEE2"); 

// IntersectionObserver 설정: #ISEE 요소의 투명도를 조절하여 Fade In/Out 효과를 줍니다.
let OpacityObserver = new IntersectionObserver((entries) => {
    entries.forEach((box) => {
        if (box.isIntersecting) {
            box.target.style.opacity = 1;
        } else {
            box.target.style.opacity = 0;
        }
    });
}, { threshold: 0.2 });

Isee.forEach(element => OpacityObserver.observe(element));


// --- .Out-Detail-Text 요소의 타이핑 애니메이션 ---

// Out-Detail-Text와 Out-Detail-Text2 모두 선택
let TextAnimation = document.querySelectorAll(".Out-Detail-Text, .Out-Detail-Text2");
const originalTexts = [];
const typingSpeed = 30; // 타이핑 속도 (ms)

// Map to store timeouts for each element to handle the 1.5s delay
const typingTimeouts = new Map();

// 1. 모든 텍스트 요소를 순회하며 원본 텍스트를 저장하고, 내용을 비웁니다.
TextAnimation.forEach((element, index) => {
    // 텍스트를 저장합니다.
    originalTexts[index] = element.textContent;
    // 초기에는 텍스트를 비워 타이핑이 시작되도록 준비합니다.
    element.textContent = '';
    // 타이핑 중 텍스트가 잘리지 않도록 opacity를 1로 설정합니다. 
    element.style.opacity = 1; 
    // 줄바꿈이 자연스럽게 되도록 white-space 스타일을 보장합니다.
    element.style.whiteSpace = 'normal';
    
    // 타이핑 상태를 추적하기 위한 사용자 정의 속성
    element.dataset.isTyping = 'false';
});

/**
 * 주어진 요소에 텍스트를 한 글자씩 타이핑하는 애니메이션을 실행합니다.
 * @param {HTMLElement} element - 텍스트를 타이핑할 DOM 요소
 * @param {string} text - 출력할 전체 텍스트
 */
function typeWriter(element, text) {
    // 이미 타이핑 중이라면 중복 실행 방지
    if (element.dataset.isTyping === 'true') {
        return;
    }
    
    element.dataset.isTyping = 'true'; // 타이핑 시작 플래그 설정
    element.textContent = ''; // 내용 초기화 (다시 타이핑하기 위해)

    let i = 0;
    
    // 타이핑 시작 전에 커서 표시를 위한 클래스 추가
    element.classList.add('typing-cursor');

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            // 다음 글자 출력을 위해 setTimeout 재귀 호출
            setTimeout(type, typingSpeed);
        } else {
            // 타이핑이 끝나면 플래그 해제 및 커서 효과 제거
            element.classList.remove('typing-cursor');
            element.dataset.isTyping = 'false';
        }
    }
    type(); // 타이핑 시작
}

// 2. IntersectionObserver 설정: 요소가 화면에 나타나면 1.5초 후에 타이핑 함수를 실행합니다.
let TextTypingObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const targetElement = entry.target;
        // index 계산은 TextAnimation NodeList 전체에서 이루어집니다.
        const index = Array.from(TextAnimation).indexOf(targetElement);
        const currentTimeout = typingTimeouts.get(targetElement);

        // 이전 지연 타이머가 있다면 취소합니다.
        if (currentTimeout) {
            clearTimeout(currentTimeout);
            typingTimeouts.delete(targetElement);
        }

        if (entry.isIntersecting) {
            // 화면에 진입했습니다. 1.5초(1500ms) 후에 타이핑을 시작합니다.
            const newTimeout = setTimeout(() => {
                // index가 유효하고, 원본 텍스트가 있다면 타이핑 실행
                if (index !== -1 && originalTexts[index]) {
                    // 텍스트를 다시 타이핑할 때만 실행
                    if (targetElement.textContent !== originalTexts[index]) {
                         typeWriter(targetElement, originalTexts[index]);
                    }
                }
                // 타이핑이 시작되면 맵에서 지연 타이머를 제거합니다.
                typingTimeouts.delete(targetElement);
            }, 1500); // 1.5초 지연

            // 새로운 지연 타이머를 맵에 저장합니다.
            typingTimeouts.set(targetElement, newTimeout);
        } else {
            // 화면에서 벗어났을 때의 로직 (현재는 변화 없음)
        }
    });
}, { threshold: 0.5 }); // 요소의 50%가 뷰포트에 들어왔을 때 감지

// 3. 모든 TextAnimation 요소에 대해 관찰을 시작합니다.
TextAnimation.forEach(textElement => {
    TextTypingObserver.observe(textElement);
});