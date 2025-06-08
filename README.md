# 🪙 Selective Share Reward Token

## 🔍 소개
“웹3 기반 광고 보상 구조”의 실현을 목표로 한 실습 예제입니다.
사용자의 행동(데이터 제공, 캠페인 참여 등)에 대해 토큰으로 직접 보상하는 구조를 구현하고자 합니다.

현재 프로젝트는 다음을 포함합니다:
- Solidity로 보상용 ERC-20 토큰 컨트랙트 작성
- Hardhat을 통한 테스트 및 로컬 배포
- NestJS 백엔드와의 스마트 컨트랙트 연동
- polygon-amoy 테스트넷 배포 (저렴한 수수료)

향후 확장 방향
- 사용자 제출 데이터에 대한 단계별 보상 설계
- 캠페인 등록 / 참여 기반 보상 연동
- 사용자 대시보드 연계
* IPFS / ZKP 기반 사용자 데이터 제공 구조 추가

---

## 🚀 주요 기능

- ✅ ERC-20 기반 사용자 보상 토큰 (`PDT`) 컨트랙트 작성
- ✅ 팀/투자자/운영자 지갑에 초기 토큰 분배 가능
- ✅ 사용자 데이터 제출/광고클릭 보상 지급 포함
- ✅ Hardhat 기반 로컬 개발 환경 구성 및 컨트랙트 배포

---

## 로컬 실행 가이드
# 1. 의존성 설치
npm install

# 2. 테스트 또는 컴파일
npx hardhat test
npx hardhat compile

# 3. 로컬 Hardhat 노드 실행
npx hardhat node

# 4. 스마트컨트랙트 배포 (로컬 네트워크 기준)
npx hardhat run --network localhost scripts/deploy.js
# 또는
npx hardhat ignition deploy ./ignition/modules/PDTTokenModule.ts

---

## 🧱 구성요소

| 폴더                       | 설명                              |
| ------------------------ | ------------------------------- |
| `contracts/PersonalDataToken.sol` | ERC20 보상 토큰 컨트랙트                |
| `scripts/deploy.js`      | 하드햇 배포 스크립트                     |
| `test/`                  | 유닛 테스트 작성 폴더               |

---

## License
이 프로젝트는 MIT 라이선스 하에 배포됩니다.
자세한 내용은 LICENSE 파일을 참고하세요.
