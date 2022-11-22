const BridgeMaker = require("../utils/BridgeMaker");
const { generate } = require("../utils/BridgeRandomNumberGenerator");
const { LETTER, NEW_LINE, MAP } = require("../utils/Constant");

/**
 * 다리 건너기 게임을 관리하는 클래스
 */
class BridgeGame {
  #bridge;
  #moves = [];
  #trialTime = 1;

  setBridge(number) {
    this.#bridge = BridgeMaker.makeBridge(number, generate);
  }

  /**
   * 사용자가 칸을 이동할 때 사용하는 메서드
   * <p>
   * 이동을 위해 필요한 메서드의 반환 값(return value), 인자(parameter)는 자유롭게 추가하거나 변경할 수 있다.
   */
  move(letter) {
    this.#moves.push(letter);
  }

  /**
   * 사용자가 게임을 다시 시도할 때 사용하는 메서드
   * <p>
   * 재시작을 위해 필요한 메서드의 반환 값(return value), 인자(parameter)는 자유롭게 추가하거나 변경할 수 있다.
   */
  retry = () => {
    this.#moves = [];
    this.#trialTime += 1;
  };

  getResult() {
    const resultArray = this.#makeResultArray();
    const map = this.#drawMap(resultArray);
    const isCorrect = this.#isCorrect();
    const isGameOver = this.#isGameOver();

    return { map, isCorrect, isGameOver, trialTime: this.#trialTime };
  }

  #makeResultArray() {
    return this.#moves.map((move, ind) => [
      move,
      this.#bridge[ind] === move ? MAP.correct : MAP.wrong,
    ]);
  }

  #drawMap(resultArray) {
    return [LETTER.up, LETTER.down]
      .map(
        (upOrDown) =>
          `[ ${resultArray
            .map(([userUorD, isCorrect]) =>
              userUorD === upOrDown ? isCorrect : MAP.blank
            )
            .join(MAP.divider)} ]`
      )
      .join(NEW_LINE);
  }

  #isCorrect() {
    const lastIndex = this.#moves.length - 1;
    return this.#moves[lastIndex] === this.#bridge[lastIndex];
  }

  #isGameOver() {
    return this.#bridge.length === this.#moves.length;
  }
}

module.exports = BridgeGame;