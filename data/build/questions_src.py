"""Hand-written content for data/questions.json (backend part 3).

build_questions.py turns this into data/questions.json and fails if any quote
is not word for word in its source, or if an answer cites something it should
not. Ranks and evidence strength are computed there, not written here.

Quote helpers:
  T / E / F (field, text)          PSI quote from this row's own record:
                                   tested / expected / found.
  GT / GE / GF (page, text)        Researcher's Guide quote: tested / expected / found.
  PAGE_T (text)                    NASA Combustion Science page, tested.

Answer sentences:
  S(text, cites=[...], basis=[...], scope=False)
  `cites`  investigations the sentence rests on (become citation chips).
  `basis`  quotes not tied to one of the 24 (Guide statements about the field).
  `scope`  True only for a sentence that states what the data does NOT cover.
  A sentence that says "found" must rest on at least one Found quote.
"""

GUIDE = "https://www.nasa.gov/sites/default/files/atoms/files/np-2015-10-034-jsc_combustion_in_reduced_gravity-iss-mini-book-011116-508.pdf"
CPAGE = "https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/"

OBJ, APP, HYP, IMP = "Objectives", "Approach", "Hypothesis", "Research Impacts/Earth Benefits"


def _q(kind, source, text, page=None):
    q = {"kind": kind, "text": text, "source": source}
    if page:
        q["page"] = page
    return q


def T(field, text): return _q("tested", field, text)
def E(field, text): return _q("expected", field, text)
def F(field, text): return _q("found", field, text)
def GT(page, text): return _q("tested", GUIDE, text, page)
def GE(page, text): return _q("expected", GUIDE, text, page)
def GF(page, text): return _q("found", GUIDE, text, page)
def PAGE_T(text): return _q("tested", CPAGE, text)


def S(text, cites=(), basis=(), scope=False):
    s = {"text": text, "cites": list(cites)}
    if basis:
        s["basis"] = list(basis)
    if scope:
        s["scope"] = True
    return s


def R(inv, why, *quotes):
    return {"investigation": inv, "why": why, "quotes": list(quotes)}


# Reused quotes ---------------------------------------------------------------

BRE_NO_FLOW = F(IMP, "Quasi-steady burning corresponding to various condensed-phase materials (such as PMMA and Nylon) was observed in microgravity despite the absence of air flow, where the cessation of ventilation is an established step in putting out spacecraft fires.")
BRE_HIGH_O2 = F(IMP, "The ongoing combustion without air flow was notably seen in elevated-oxygen atmospheres which are being considered for use in future spacecraft, whereas such flames in a normal atmosphere of 21% oxygen self-extinguished in a short time.")
BRE_PRELIM = F(IMP, "While BRE’s results are still preliminary, they suggest that NASA may want to increase use of its alternative flammability Test 2, with the cone calorimeter, where that test can measure material properties corresponding to the microgravity flames observed with the BRE burner.")
BRE_ATMOS = T(OBJ, "NASA - considered atmosphere for human space missions will be examined: 14.7 psia, 21 % oxygen: 10.2 psia, 26.5 %; and 8.2 psia, 34 % oxygen.")

BASS_LOWER_O2 = GF("31", "Recent results from the BASS experiment currently running on the ISS indicate that NASA-STD-6001 Test 1 is not conservative, and materials can burn at lower oxygen levels in microgravity than on Earth.")
BASS_LOCAL_JET = GF("31", "Also, current findings show that local application of suppressant is not adequate for flame extinguishment. The local jet entrains air and sustains the flame even when the ambient airflow is turned off.")
BASS_N2_STRENGTHEN = GF("22", "Early results have demonstrated that nitrogen applied to the flame can actually strengthen it because of this effect.")
BASS_FLOW_RESULT = GF("19", "The tests have yielded useful results on the flow-velocity effect and flame suppression (by nitrogen), and the quick return of the test results has helped to guide the next, more complete flight experiments.")
# The Guide says "BASS" for the 2012-on glovebox runs and does not separate BASS
# (PSI-26) from BASS-II (PSI-25), so BASS_FLOW_RESULT, BASS_LOWER_O2 and
# BASS_LOCAL_JET are cited on both rows (found-quotes.json: alsoAbout).
BASS_HYP = E(HYP, "BASS experiments were based on the hypothesis that materials in microgravity, with adequate ventilation, burn as well if not better than the same material in normal gravity with other conditions being identical (pressure, oxygen concentration, temperature, etc.)")
BASS_FLOW = T(APP, "Airflow was controlled using a variable speed fan, with airflow speeds reaching as high as 40 cm/s.")

BASS2_HYP = E(HYP, "BASS–II tests the hypothesis that materials in microgravity, with adequate ventilation, burn as well if not better than the same material in normal gravity with other conditions being identical (pressure, O2 concentration, temperature, etc.).")
BASS2_NOT_CONSERVATIVE = E(HYP, "NASA tests and controls materials from a flammability perspective using an upward burning test in normal gravity, which is considered to be the worst-case geometry for flammability of the material on Earth. However, it may not be conservative for flammability in space.")
BASS2_VARS = T(APP, "Main variables are airflow speed and oxygen concentration (oxygen varied below 21% by adding nitrogen).")

FLEX_SUPPRESSANT_MARGIN = GF("12", "The research to date has shown that the flammability limit is lower in reduced gravity. The implication is that terrestrial standards for inert gas suppressants in low gravity do not offer the same margin of safety as in normal gravity.")
FLEX_LOI = GF("36", "To date, these experiments have identified both the radiative and diffusive extinction limits for heptane and methanol droplets and identified an LOI that is both significantly lower than in normal gravity and lower than previously predicted and anticipated.")
FLEX_COOL_SUPPORT = GF("33", "This vaporization, we now know, is supported by a lower-temperature cool flame that forms after visible flame extinction.")
FLEX_COOL_LONG = GF("34", "The FLEX tests showed that the cool flame can burn for a prolonged period of time.")
FLEX_REIGNITE = GF("41-42", "This research also has significant impact on spacecraft fire safety concerns; reduced-gravity environments have been shown to be particularly conducive to a low-temperature combustion regime marked by very weak but persistent flames, invisible to the unaided eye, that will spontaneously re-ignite long after the visible flame has been extinguished.")
FLEX_SUPPRESSANTS = T(OBJ, "The FLEX (Flame Extinguishment Experiment) investigation aims to map the flammability limits of liquid fuels in microgravity environments, measure the effectiveness of various gaseous fire suppressants such as CO2, He, and SF6, and develop reliable predictive models for combustion limits under reduced gravity conditions.")

SAFFIRE_OBJ_1_3 = T(OBJ, "The objectives of this investigation were to: (1) determine how rapidly a large scale fire grows in low-gravity and (2) investigate the low-g flammability limits compared to those obtained in NASA’s normal gravity material flammability screening test.")
SAFFIRE_OBJ_2 = T(OBJ, "The objectives of SAFFIRE-II are to determine how rapidly a large scale fire grows in low-gravity and to investigate the low-g flammability limits compared to those obtained in NASA’s normal gravity material flammability screening test.")
SAFFIRE_HYP = E(HYP, "This investigation hypothesizes that due to large differences between fire behavior in normal and reduced gravity, the use of terrestrial fires and fire standards to design spacecraft fire safety systems presents an inherent risk to the vehicle because of the significant level of uncertainty.")
SAFFIRE_EARTH = E(IMP, "Studying fire in small, sealed environments such as the Cygnus cargo supply vehicle benefits fire safety and prevention efforts on Earth, including inside mines, airplanes, or submarines.")

SAME_DETECTOR_HYP = E(HYP, "The change in the size distribution and number density will, in turn, affect the response of the smoke detectors and possibly result in some detectors not producing an alarm when exposed to this smoke.")
SAME_BIGGER_HYP = E(HYP, "In particular, it is hypothesized that liquid aerosol smokes produced in microgravity will exhibit substantially larger droplet sizes than under the same conditions in normal gravity (with a corresponding decrease in the particle number density for the same mass of smoke).")

# General Guide statements (not tied to one investigation) ---------------------

G_VENT_MARGIN = GF("18", "Microgravity experiments demonstrated that the assumed margin of safety of reduced flammability in microgravity, based on quiescent test results, may not be valid for most spacecraft environments where ventilation flow strongly enhances flames.")
G_PARTIAL_G = GF("18", "In the low-flow conditions of microgravity or partial gravity, some materials are flammable at lower oxygen concentrations than in normal gravity (Figure 8).")
G_EASIER_IGNITE = GF("18", "Materials are easier to ignite in low gravity because of reduced natural convective cooling from the fuel surface.")
G_HALF_FLUX = GF("24", "By developing a theoretical model for the ignition time, it was also shown that the critical heat flux for ignition in microgravity can be as short as half the value measured in normal gravity.")
G_10CMS = GF("31", "For flame spread across solid materials, the characteristic gas velocity of the minimum in the curve is on the order of 10 cm/s and also corresponds to a maximum in the flame spread rate. To give perspective, this is the velocity typical of that of spacecraft ventilation systems.")
G_UPSTREAM = GF("31", "Completely contrary to normal-gravity behavior, the flame spreads upstream, into the oncoming airflow, in space when the forced-flow velocities are low (Figure 9); whereas, the flame always spreads downstream, in the buoyant flow direction, in normal gravity, even in the absence of forced flow.")
G_PARTICLES = GF("35", "Fundamental research in microgravity highlighted the vastly different particulate size associated with flames in microgravity. Since many fire detectors operate by sensing fire-generated particulates, they would need to use different signatures to detect fires in microgravity.")
G_NEW_DEVICE = GF("35", "One of the achievements in this area is a new device that monitors particulates and chemical species simultaneously to better detect the onset of a fire.")
G_TUNED = GF("35", "The new device can be “tuned” to examine particulates and species characteristics associated with fires in microgravity.")
# The Guide lists "a fire will self-extinguish if ventilation is shut off" as a
# MISCONCEPTION. Quote it with its framing so it can never read as a finding.
G_MISCONCEPTIONS = GF("35", "This resulted in several critical misconceptions about potential fires in spacecraft: 1. A steady fire cannot exist in a quiescent microgravity environment. 2. A fire will self-extinguish if ventilation is shut off.")
G_FALLACY = GF("35", "Research at NASA GRC in both ground-based laboratories and microgravity facilities and space-based microgravity experiments (summarized by Friedman and Ross, 2001 and Ruff et al., 2009) demonstrates the fallacy of these assumptions")
G_CANDLE = GF("30", "Contrary to published speculation, the microgravity flame burned in some tests for over 45 minutes before extinguishing from a lack of fuel.")
G_WATER_MIST = GF("26", "The first two of the planned nine water-mist portable fire extinguishers were sent to the ISS in December 2015 to replace CO2 units that are currently onboard.")
G_FALSE_ALARMS = GT("26", "The conditions on a spacecraft require rapid detection of fires with limited false alarms.")
FM2 = PAGE_T("FM2 investigates burning materials on the Moon at its 1/6 reduced gravity level.")


QUESTIONS = [
    # ------------------------------------------------------------------ PREVENT
    {
        "id": "moon-base-oxygen",
        "pillar": "prevent",
        "question": "Is a 30% oxygen Moon Base safe?",
        "answer": [
            S("NASA found that flames which went out quickly in normal 21% oxygen kept burning with no airflow at all in the elevated-oxygen atmospheres being considered for future spacecraft.", ["PSI-20"]),
            S("NASA also found that materials can burn at lower oxygen levels in microgravity than on Earth, so the standard Earth screening test is not conservative.", ["PSI-26", "PSI-25", "PSI-69"]),
            S("None of the 24 investigations burned anything at Moon gravity, so this answer is bounded by microgravity and Earth results, not measured for a Moon Base.", scope=True),
        ],
        "evidence": [
            R("PSI-20", "Burned fuels set up to act like real materials in the exact raised-oxygen, low-pressure cabin air NASA is considering.",
              BRE_ATMOS, BRE_HIGH_O2, BRE_PRELIM),
            R("PSI-26", "Showed in orbit that materials burn at lower oxygen than Earth tests predict.",
              BASS_LOWER_O2, BASS_HYP),
            R("PSI-69", "Found the lowest oxygen level that supports burning fuel droplets is far lower in microgravity.",
              FLEX_LOI),
            R("PSI-25", "Varied oxygen and airflow over solid samples to test whether Earth's screening test holds in space.",
              BASS2_VARS, BASS_LOWER_O2, BASS2_NOT_CONSERVATIVE),
            R("PSI-98", "Set out to compare large-fire flammability limits in low gravity with NASA's Earth screening test.",
              SAFFIRE_OBJ_1_3, SAFFIRE_HYP),
        ],
        "unknown": [
            "How materials burn at Moon gravity (1/6 g): none of the 24 investigations tested partial gravity.",
            "Whether 30% oxygen in particular is safe: BRE examined 26.5% and 34% oxygen at reduced pressure, not 30%.",
            "BRE's own record calls its results preliminary.",
        ],
        "habitats": ["moon-base", "mars-base", "spacecraft"],
        "earth": None,
    },
    {
        "id": "cabin-airflow",
        "pillar": "prevent",
        "question": "Does cabin airflow feed a fire?",
        "answer": [
            S("Yes: NASA found that the safety margin seen in still air may not hold in spacecraft, where ventilation flow strongly enhances flames.", basis=[G_VENT_MARGIN]),
            S("NASA found that flames over solids can survive at the lowest oxygen, and spread fastest, at an airflow of about 10 cm/s, which is typical of spacecraft ventilation.", basis=[G_10CMS]),
            S("BASS, BASS-II and the three SAFFIRE fires burned materials in airflows of 20 to 40 cm/s to study this.", ["PSI-26", "PSI-25", "PSI-98", "PSI-99", "PSI-100"]),
        ],
        "evidence": [
            R("PSI-26", "Burned fabrics and plastics in a fan-driven flow up to 40 cm/s, with stated results on the flow effect.",
              BASS_FLOW, BASS_FLOW_RESULT, BASS_HYP),
            R("PSI-25", "Varied airflow speed directly in a small wind tunnel in the glovebox.",
              T(APP, "Fuel samples were mounted inside a small wind tunnel which could impose airflow speeds up to 40 cm/s."), BASS_FLOW_RESULT, BASS2_HYP),
            R("PSI-99", "Large-scale fires in a cargo ship, run at two airflow speeds and both flow directions.",
              T(APP, "Depending on the sample material, the Saffire-II was conducted at an air flow velocity of either 20 or 30 cm/s, the flow being either concurrent or opposed."), SAFFIRE_OBJ_2),
            R("PSI-100", "Repeated the SAFFIRE-I fabric at a faster airflow.",
              T(APP, "However, the experiments were conducted at a flow velocity of 30 cm/s compared to 20 cm/s during Saffire I.")),
            R("PSI-98", "First large-scale fire in a cargo ship, at one cabin-like airflow.",
              T(APP, "Saffire-I was conducted at an air flow velocity of 20 cm/s."), SAFFIRE_HYP),
            R("PSI-62", "Ground model of flame spread built against BASS images, aimed at the flow range where flames survive best.",
              T(APP, "The evaluation metrics included flame geometry, temperature distribution, soot volume fraction, and flame spread rate, with special emphasis on reproducing the “Goldilocks” flammability zone reported by Olson and Ferkul.")),
        ],
        "unknown": [
            "How fast the SAFFIRE fires grew: the saved PSI text and the Researcher's Guide do not state the results.",
            "Airflow effects at Moon or Mars gravity, which none of the 24 tested.",
        ],
        "habitats": ["spacecraft", "station", "moon-base", "mars-base", "rover"],
        "earth": None,
    },
    {
        "id": "materials",
        "pillar": "prevent",
        "question": "Which materials burn differently up there?",
        "answer": [
            S("NASA found that materials can burn at lower oxygen levels in microgravity than on Earth, so the upward-burning Earth screening test is not conservative.", ["PSI-26", "PSI-25"]),
            S("NASA also found materials are easier to ignite in low gravity, with the heat needed for ignition as low as half the Earth value.", basis=[G_EASIER_IGNITE, G_HALF_FLUX]),
            S("A gas burner set up to behave like PMMA and Nylon kept burning steadily in microgravity with no airflow.", ["PSI-20"]),
            S("Materials burned in orbit include a cotton and fiberglass fabric, Nomex, Ultem, silicone and several forms of PMMA.", ["PSI-26", "PSI-99"]),
        ],
        "evidence": [
            R("PSI-26", "Burned real spacecraft fabrics and plastics in orbit and found Earth's test is not conservative.",
              T(APP, "Custom-made fabric samples consisting of 75% cotton and 25% fiberglass (by mass) measuring were used as a fuel source as well as Nomex fabric and Ultem."), BASS_LOWER_O2),
            R("PSI-20", "Emulated the burning of real solids with a gas burner, with a stated result for PMMA and Nylon.",
              BRE_NO_FLOW, BRE_PRELIM),
            R("PSI-99", "Burned nine samples of five materials in one large-scale run.",
              T(APP, "As a follow on to the Saffire-I investigation, the Saffire-II investigation added more samples including SIBAL, silicone, structure PMMA, flat PMMA, and PMMA with Nomex.")),
            R("PSI-25", "Burned thicker, realistic fuel shapes rather than thin sheets.",
              T(OBJ, "Practical, realistic (thicker) fuels in typical geometries will be examined, including slabs, cylinders, and spherical sections."), BASS_LOWER_O2, BASS2_NOT_CONSERVATIVE),
            R("PSI-98", "Burned a near-metre-long piece of fabric, far larger than glovebox samples.",
              T(APP, "The sample was approximately 0.94 meters long and 0.4 meters wide, simulating a large piece of flammable fabric.")),
            R("PSI-62", "Ground model meant to screen new materials' flammability limits.",
              E(IMP, "This research provides predictive tools for screening new materials’ flammability limits, which can lead to the design of safer spacecrafts.")),
        ],
        "unknown": [
            "A ranking of which material is worst: the saved text names the materials tested but does not say which burned most readily.",
            "Whether the BRE result holds for real PMMA and Nylon, not the gas burner emulating them.",
        ],
        "habitats": ["spacecraft", "station", "moon-base", "mars-base", "rover"],
        "earth": None,
    },
    # ------------------------------------------------------------------- DETECT
    {
        "id": "alarm-no-rising-smoke",
        "pillar": "detect",
        "question": "Will an alarm catch a fire with no rising smoke?",
        "answer": [
            S("Not necessarily: NASA found that flames in microgravity make particles of a vastly different size, so particle-sensing fire detectors would need different signatures in space.", basis=[G_PARTICLES]),
            S("SAME and SAME-R overheated spacecraft materials in orbit and recorded how smoke detectors responded, expecting larger smoke particles that might keep some detectors from alarming.", ["PSI-102", "PSI-101"]),
            S("A ground study using SAME data modelled how the loss of buoyancy changes the smoke that forms.", ["PSI-115"]),
        ],
        "evidence": [
            R("PSI-102", "Measured smoke from overheated spacecraft materials in orbit and checked two smoke detectors against it.",
              T(APP, "The operator then ran the self diagnostic procedures on the two smoke detectors and activated the video cameras, turned on the igniter for a predefined period of time (15 to 60 seconds), and initiated the thermophoretic soot samplers to sample the smoke."),
              SAME_BIGGER_HYP, SAME_DETECTOR_HYP),
            R("PSI-101", "Repeated SAME with a fire-retardant foam, hotter tests and a new instrument.",
              T(APP, "SAME-R flight tests were conducted from July 16, to September 9, 2010, successfully completing 66 test points."),
              SAME_DETECTOR_HYP),
            R("PSI-115", "Ground simulation of how smoke particles grow with and without gravity.",
              T(OBJ, "The intention of this effort is to quantify the differences between microgravity and Earth gravity smoke, and to identify the fluid dynamic mechanisms that cause the differences."),
              E(HYP, "Without buoyancy, mixing and heat transfer are reduced, the time-temperature history of the combustion vapors (or particle precursors) and particle trajectories are significantly altered, changing the composition of the smoke.")),
            R("PSI-47", "Checked that the particle counter SAME relied on would work in microgravity.",
              T(OBJ, "DAFT / DAFT-2 tests that a modified P-Trak particulate counter would be accurate in microgravity.")),
        ],
        "unknown": [
            "SAME's measured particle sizes and whether its detectors alarmed: the saved text gives the method and hypothesis, not the results.",
            "How smoke behaves at Moon or Mars gravity, which none of the 24 tested.",
        ],
        "habitats": ["spacecraft", "station", "moon-base", "mars-base", "rover"],
        "earth": None,
    },
    {
        "id": "smoke-or-dust",
        "pillar": "detect",
        "question": "Can a detector tell smoke from dust?",
        "answer": [
            S("NASA reports a new device that monitors particles and chemical species at the same time to better detect the onset of a fire, and that can be tuned to the particles of fires in microgravity.", basis=[G_NEW_DEVICE, G_TUNED]),
            S("DAFT measured the background dust on the ISS and checked that a modified particle counter works in microgravity, using Arizona Red Dust as a test standard.", ["PSI-47"]),
            S("None of the 24 records states whether a detector in orbit actually told smoke from dust.", scope=True),
        ],
        "evidence": [
            R("PSI-47", "The only investigation that measured dust in the station's air.",
              GT("26", "The Dust Aerosol measurement Feasibility Test examined the background aerosol particulate levels on the ISS."),
              T(APP, "Arizona Red Dust (ARD) was chosen as an aerosol standard due to its ease of dispersion."),
              E(IMP, "Extended duration space flight missions with larger vessels will require fire detection systems with increased reliability and sensitivity.")),
            R("PSI-102", "Measured the particle sizes of smoke from spacecraft materials, the other half of the comparison.",
              GT("26", "The Smoke Aerosol Measurement Experiment (SAME) examined the particle-size distribution of the smoke from spacecraft materials."),
              SAME_BIGGER_HYP),
            R("PSI-101", "Added a new instrument to the SAME hardware.",
              T(APP, "3) a new instrument, M-pass, developed in-house GRC, was used to replace one of the two Commercial Diagnostic Enclosures that includes a DustTrak and an ionization detector used in SAME.")),
        ],
        "unknown": [
            "False-alarm rates for dust in orbit: NASA says spacecraft need rapid detection with limited false alarms, but no record gives a measured rate.",
            "Lunar or Martian dust, which none of the 24 used.",
        ],
        "habitats": ["spacecraft", "station", "moon-base", "mars-base", "rover"],
        "earth": None,
    },
    {
        "id": "early-fire-look",
        "pillar": "detect",
        "question": "What does an early space fire look like?",
        "answer": [
            S("In space, fuels burn as oval balls rather than the upward-pointed cone seen on Earth.", ["PSI-25"]),
            S("NASA found that in low airflow a flame on a thin fuel spreads upstream into the oncoming air, the opposite of Earth, where it always spreads downstream.", basis=[G_UPSTREAM]),
            S("It can also be close to invisible: FLEX found a cool flame that keeps burning after the visible flame goes out.", ["PSI-69"]),
        ],
        "evidence": [
            R("PSI-25", "Its record states the basic shape difference between space and Earth flames.",
              F(IMP, "In outer space, fuels burn as oval balls rather than with an upward pointed cone flame as they do on Earth.")),
            R("PSI-69", "Discovered cool flames that burn on after the visible flame is out.",
              FLEX_COOL_SUPPORT, FLEX_COOL_LONG),
            R("PSI-26", "Filmed burning fabric from two angles and recorded flame size, shape and colour.",
              T(APP, "Flames were observed in the top and edge profiles and data was collected on flame size, shape, color, spread rate, and potential flame quenching.")),
            R("PSI-60", "Ground analysis of SPICE images, expecting longer, dimmer, sootier flames in microgravity.",
              E(HYP, "Microgravity conditions would produce longer, more diffuse flames with lower temperatures and increased soot concentrations compared to normal gravity, and that careful integration of experimental temperature fields into the simulations would reduce discrepancies between measured and predicted soot distributions.")),
            R("PSI-107", "Studied 526 gas jet flames to see when they start to give off soot.",
              T(APP, "In total 526 flames were studied."),
              E(HYP, "Flame properties are expected to differ significantly from those observed under normal gravity.")),
        ],
        "unknown": [
            "What an early fire looks like in a real cabin, with clutter and changing airflow.",
            "Flame shape at Moon or Mars gravity, which none of the 24 tested.",
        ],
        "habitats": ["spacecraft", "station", "moon-base", "mars-base", "rover"],
        "earth": None,
    },
    # ----------------------------------------------------------------- SUPPRESS
    {
        "id": "put-it-out",
        "pillar": "suppress",
        "question": "What puts a fire out without gravity?",
        "answer": [
            S("NASA found that the flammability limit is lower in reduced gravity, so inert-gas suppressants designed to Earth standards do not give the same margin of safety in space.", ["PSI-69"]),
            S("NASA also found that spraying suppressant locally is not enough: the jet pulls in air and keeps the flame going, and nitrogen applied to a flame can even strengthen it.", ["PSI-26"]),
            S("The ISS began replacing its CO2 extinguishers with water-mist units in December 2015.", basis=[G_WATER_MIST]),
        ],
        "evidence": [
            R("PSI-69", "Measured how well CO2, helium and SF6 suppress burning fuel, with a stated result on safety margins.",
              FLEX_SUPPRESSANTS, FLEX_SUPPRESSANT_MARGIN, FLEX_LOI),
            R("PSI-26", "Tested an ISS-style inert gas on burning solids, with stated results.",
              T(OBJ, "2.) Assess the effectiveness of an inert, gaseous extinguishing agent (similar to that used on ISS) in putting out flames over different materials, geometries, preheating, and flow."),
              BASS_LOCAL_JET, BASS_N2_STRENGTHEN),
            R("PSI-68", "Extended FLEX to fuel mixtures, including when and how flames go out.",
              T(OBJ, "3. Study flame extinction mechanisms and their boundaries.")),
            R("PSI-10", "Measured when spherical gas flames go out as nitrogen and pressure change.",
              T(OBJ, "C. Obtain extinction limits as functions of Zst, amount of N2, and pressure for normal and inverse spherical C2H4 and CH4 flames."),
              E(HYP, "2. Microgravity spherical diffusion flames extinguish when the peak temperature first decreases below 1130 K.")),
            R("PSI-25", "Studied extinction limits of solid fuels in slow airflow.",
              T(OBJ, "1) Study the ignition, flame growth, flame spread, and extinction limits for solid fuels burning in low-velocity forced flows in microgravity."),
              BASS_LOCAL_JET),
        ],
        "unknown": [
            "Which suppressant works best on a real cabin fire: the saved text gives no numbers for FLEX's suppressant tests.",
            "How water mist performs in microgravity: none of the 24 tested it.",
        ],
        "habitats": ["spacecraft", "station", "moon-base", "mars-base", "rover"],
        "earth": None,
    },
    {
        "id": "fans-off",
        "pillar": "suppress",
        "question": "Does switching off the fans stop it?",
        "answer": [
            S("Not reliably. NASA lists \"a fire will self-extinguish if ventilation is shut off\" among the misconceptions its microgravity research showed to be false.", basis=[G_MISCONCEPTIONS, G_FALLACY]),
            S("NASA found that a gas burner set up to behave like PMMA and Nylon kept burning with no airflow in elevated-oxygen air, though the same flames went out quickly in normal 21% oxygen.", ["PSI-20"]),
            S("NASA also found in BASS that a local jet of suppressant pulled in air and kept the flame going even with the ambient airflow turned off.", ["PSI-26", "PSI-25"]),
            S("A candle flown on Mir burned in some tests for over 45 minutes in still air before running out of fuel.", basis=[G_CANDLE]),
        ],
        "evidence": [
            R("PSI-20", "Directly observed steady burning with no airflow, in the cabin air NASA is considering.",
              BRE_NO_FLOW, BRE_HIGH_O2, BRE_PRELIM),
            R("PSI-26", "Saw a flame survive with the ambient airflow turned off.",
              BASS_LOCAL_JET),
            R("PSI-69", "Burned fuel droplets in still air and found cool flames that last a long time.",
              GF("33", "Recent spaceflight experiments (FLEX) involving single alkane droplets burning in a quiescent ambient uncovered unexplained and unexpected behavior."),
              FLEX_COOL_LONG),
            R("PSI-25", "Built to test whether ventilation makes materials burn as well as on Earth or better.",
              BASS_LOCAL_JET, BASS2_HYP),
        ],
        "unknown": [
            "BRE calls its results preliminary, and its fuel was a gas burner emulating solids.",
            "How long a real cabin fire keeps burning with the fans off at 21% oxygen.",
        ],
        "habitats": ["spacecraft", "station", "moon-base", "mars-base", "rover"],
        "earth": None,
    },
    {
        "id": "comes-back",
        "pillar": "suppress",
        "question": "Can a fire come back after it looks out?",
        "answer": [
            S("Yes, for some fuels: FLEX found that after the visible flame went out, a cool flame kept burning the fuel for a prolonged time.", ["PSI-69"]),
            S("NASA's Guide says low gravity favours very weak but persistent flames, invisible to the unaided eye, that will spontaneously re-ignite long after the visible flame is out.", ["PSI-69"]),
            S("Ground work built on FLEX data found that a \"warm flame\" plays a critical role in the switch between cool and hot flames.", ["PSI-142"]),
        ],
        "evidence": [
            R("PSI-69", "Discovered the cool flames that keep burning after the visible flame is out.",
              FLEX_COOL_SUPPORT, FLEX_COOL_LONG, FLEX_REIGNITE),
            R("PSI-142", "Ground study using FLEX data, with stated results on cool, warm and hot flame transitions.",
              F(IMP, "The results showed that the warm flame has a double reaction zone structure and plays a critical role in the transition between cool flames and hot flames.")),
            R("PSI-159", "Flew gas cool flames, expecting them to flip between cool and hot as fuel flow changes.",
              E(HYP, "5. Cool diffusion flames for which a decrease in fluent flow rate will cause extinction, whereas an increase will cause a transition to a hot diffusion flame, with oscillation possible between hot and cool flames.")),
            R("PSI-117", "Ground model of what pushes an existing cool flame to go out or turn into a hot flame.",
              T(OBJ, "Focusing on both small and large droplets, the work mapped stability windows for ignition, sustained oscillation, transitions to hot ignition and warm-flame behavior, and extinction under microgravity.")),
            R("PSI-39", "Followed FLEX with more cool-flame droplet tests over a range of pressures.",
              T(OBJ, "1) Examine the combustion behavior of n-dodecane and mixtures of n-dodecane/iso-dodecane at pressures ranging from 0.25 atm to 5 atm.")),
            R("PSI-68", "Continued FLEX with fuel mixtures.",
              T(OBJ, "2. Examine the steady and unsteady liquid and gas-phase phenomena in pure fuel combustion.")),
        ],
        "unknown": [
            "Whether solid cabin materials re-ignite this way: the cool flame results are for fuel droplets and gas flames.",
            "How long after the visible flame a re-ignition can happen in a real cabin.",
        ],
        "habitats": ["spacecraft", "station", "moon-base", "mars-base", "rover"],
        "earth": None,
    },
    # ------------------------------------------------------------------- ACROSS
    {
        "id": "moon-mars",
        "pillar": "across",
        "question": "What about Moon and Mars gravity?",
        "answer": [
            S("None of the 24 investigations burned anything at Moon or Mars gravity, so everything here is bounded by microgravity and Earth results, not measured.", scope=True),
            S("NASA's Guide states that in the low-flow conditions of microgravity or partial gravity, some materials are flammable at lower oxygen concentrations than in normal gravity.", basis=[G_PARTIAL_G]),
            S("BRE was set up in part to check whether existing flammability tests still apply in low- and partial-gravity environments.", ["PSI-20"]),
            S("NASA's first burn tests on the Moon itself (FM2) are a separate experiment, not one of the 24.", basis=[FM2]),
        ],
        "evidence": [
            R("PSI-20", "The only one of the 24 whose stated purpose includes partial gravity.",
              GE("15", "Since this study controls the inherent fuel properties that affect various fire scenarios, it will ascertain the relevance of existing flammability test methods for low- and partial-gravity environments."),
              BRE_ATMOS),
            R("PSI-98", "Frames the risk of relying on Earth standards as missions go further from Earth.",
              E(HYP, "While this approach has been successful thus far, the uncertainty and risk will increase as exploration missions venture further from earth with considerably longer transit times for a safe return.")),
            R("PSI-26", "Microgravity result on oxygen limits that a Moon or Mars answer is bounded by.",
              BASS_LOWER_O2),
        ],
        "unknown": [
            "Any measured result at Moon (1/6 g) or Mars gravity: none of the 24 investigations tested it.",
            "Mars is not mentioned in the saved NASA text at all.",
        ],
        "habitats": ["moon-base", "mars-base", "rover"],
        "earth": None,
    },
    {
        "id": "earth-benefits",
        "pillar": "across",
        "question": "What has this done for Earth?",
        "answer": [
            S("Mostly groundwork so far: the records say this research feeds cleaner, more efficient engines and power plants.", ["PSI-10", "PSI-39", "PSI-159"]),
            S("Fire and smoke research for sealed spacecraft is aimed at similar places on Earth, such as submarines, mines and airplanes.", ["PSI-98", "PSI-102"]),
            S("One stated result: at high pressures like those in real engines, cool and warm flames burn over a wider range of conditions.", ["PSI-142"]),
        ],
        "evidence": [
            R("PSI-142", "The only Earth-relevant line among the 24 that states a result.",
              F(IMP, "At elevated pressures, it was found that the flammable region of warm flames and cool flames expands due to the increase in low-temperature and intermediate-temperature reactivity with pressure."),
              E(IMP, "Since many real engines operate in the 20-40 atm pressure range, therefore, cool flames and warm flames are relevant and important flame regimes for high-pressure near-limit combustion applications.")),
            R("PSI-10", "Names a concrete use: future coal power plant designs.",
              E(IMP, "For example, it is contributing to novel designs of future coal power plants.")),
            R("PSI-39", "Ties cool flames to new fuels and clean, efficient engines.",
              E(IMP, "Cool flames play a key role in the development and selection of new fuels and the design of advanced engines such as clean, high-efficiency Homogeneous Charge Compression Ignition (HCCI) engines.")),
            R("PSI-98", "Sealed-cabin fire research aimed at mines, airplanes and submarines.",
              SAFFIRE_EARTH),
            R("PSI-102", "Smoke detectors for other closed environments on Earth.",
              E(IMP, "The smoke detectors developed from the results of SAME can also be useful in other extreme environments on Earth, such as submarines or underwater laboratories.")),
            R("PSI-159", "Links cool flame chemistry to more efficient car engines.",
              E(IMP, "This should facilitate the development of more efficient internal combustion engines.")),
            R("PSI-25", "Models checked in space are used for wildfires and building fires.",
              E(IMP, "These models can then be used to more accurately study flames on Earth, such as in wildfires, building fires, energy recapture from waste recycling, and other combustion problems.")),
        ],
        "unknown": [
            "Products already on the market from these 24: the PSI records describe expected benefits, not delivered ones (the spinoff pages come in a later step).",
        ],
        "habitats": ["spacecraft", "station", "moon-base", "mars-base", "rover"],
        "earth": None,
    },
]
