# 🪙 SS2 Reward Token

## 🔍 소개

이 프로젝트는 Hardhat 샘플 프로젝트를 기반으로,  
**사용자 보상 토큰(ERC-20)**을 직접 작성하고,  
**NestJS 백엔드와 연동하는 실습 예제**입니다.

- Solidity로 보상 토큰 컨트랙트 작성
- Hardhat 기반 로컬 블록체인 환경 구성 및 배포
- NestJS 백엔드에서 컨트랙트와 상호작용 (조회 / 트랜잭션)

---

## 🚀 주요 기능

- ✅ ERC-20 기반 사용자 보상 토큰 (`SS2Token`) 컨트랙트 작성
- ✅ 팀/투자자/운영자 지갑에 초기 토큰 분배 가능
- ✅ 사용자 데이터 제출 시 보상 지급 함수 포함
- ✅ Hardhat로 로컬 개발 환경 구성 및 컨트랙트 배포
- ✅ NestJS 백엔드에서 컨트랙트 함수 호출 (`balanceOf` 등)

> ※ 이 프로젝트는 Hardhat의 Sample Project 구조를 기반으로 일부 코드를 수정/확장하여 사용자 보상 로직을 학습할 수 있도록 구성하였습니다.

---

## 🛠 시작하기

### 1. 의존성 설치
```bash
npm install
````

### 2. 테스트 or 컴파일

```bash
npx hardhat test
npx hardhat compile
```

### 3. 로컬 Hardhat 노드 실행

```bash
npx hardhat node
```

### 4. 스마트컨트랙트 배포 (로컬 네트워크 기준)

```bash
npx hardhat run --network localhost scripts/deploy.js
```

---

## 🧱 구성요소

| 폴더                       | 설명                              |
| ------------------------ | ------------------------------- |
| `contracts/SS2Token.sol` | ERC20 보상 토큰 컨트랙트                |
| `scripts/deploy.js`      | 하드햇 배포 스크립트                     |
| `test/`                  | 유닛 테스트 작성 폴더               |

---

## 🔗 향후 확장 가능 방향

* 캠페인 등록 / 참여 기반 보상 컨트랙트 연동
* 사용자 대시보드 연계
* IPFS / ZKP 기반 사용자 데이터 제공 구조 추가

---

