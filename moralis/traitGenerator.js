async function traitGenerator(traits, Moralis, collectionName) {
  const { TraitCount, ...rest } = traits;
  const traitNames = Object.keys(rest);

  for (let i = 0; i < traitNames.length; i++) {
    const traitType = traitNames[i];
    const { occurences, ...traitValues } = rest[traitType];

    const newClass = Moralis.Object.extend(`${collectionName}Traits`);
    const newObject = new newClass();

    newObject.set("traitType", traitType);
    newObject.set("traitValues", traitValues);

    await newObject.save();
    console.log(i);
  }
}

module.exports = traitGenerator;